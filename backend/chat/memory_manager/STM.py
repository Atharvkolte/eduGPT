#short term memory manager

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
from tools.summary import summary

class STMManager:
    def __init__(self):
        # 1. Connect to PostgreSQL
        self.conn = psycopg2.connect(
            host="localhost",
            port=5433,
            database="postgres",
            user="postgres",
            password=os.getenv("POSTGRES_PASSWORD")
        )
        self.conn.autocommit = True
        self.cur = self.conn.cursor()


    def create_memory_table(self, prompt: str, response: str, thread_id: int):
        # Create a single table for all threads if it doesn't exist
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id SERIAL PRIMARY KEY,
                thread_id INTEGER,
                prompt TEXT,
                response TEXT,
                created_at TIMESTAMP DEFAULT now()
            );
        """)

        # Insert the prompt and response into the table linked to thread_id
        self.cur.execute("""
            INSERT INTO memories (thread_id, prompt, response)
            VALUES (%s, %s, %s);
        """, (thread_id, prompt, response))

        self.cur.execute("SELECT COUNT(*) FROM memories WHERE thread_id = %s;", (thread_id,))
        count = self.cur.fetchone()[0]
        if(count % 5 == 0):
            self.upsert_summary(thread_id)

        # Commit changes
        self.conn.commit()
    

    def upsert_summary(self, thread_id: int):
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS summaries (
                id SERIAL PRIMARY KEY,
                thread_id INTEGER,
                summary TEXT,
                updated_at TIMESTAMP DEFAULT now()
            );
        """)
        self.conn.commit()
        self.cur.execute("""SELECT summary FROM summaries WHERE thread_id = %s ORDER BY id DESC LIMIT 1""", (thread_id,))
        row = self.cur.fetchone()
        previous_summary = row[0] if row else ""
        summarized=summary(previous_summary,self.get_last5_memory(thread_id))
        self.cur.execute("""
            INSERT INTO summaries (thread_id, summary)
            VALUES (%s, %s)
        """, (thread_id, summarized))
        self.conn.commit()

    def get_latest_summary(self, thread_id: int):
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS summaries (
                id SERIAL PRIMARY KEY,
                thread_id INTEGER,
                summary TEXT,
                updated_at TIMESTAMP DEFAULT now()
            );
        """)
        self.conn.commit()

        self.cur.execute("""SELECT summary FROM summaries WHERE thread_id = %s ORDER BY id DESC LIMIT 1""", (thread_id,))
        row = self.cur.fetchone()
        return row[0] if row else "No prior summary available."


    def get_memory(self, thread_id: int):
        # Ensure table exists BEFORE selecting
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id SERIAL PRIMARY KEY,
                thread_id INTEGER,
                prompt TEXT,
                response TEXT,
                created_at TIMESTAMP DEFAULT now()
            );
        """)
        self.conn.commit()

        self.cur.execute("SELECT prompt, response FROM memories WHERE thread_id = %s;", (thread_id,))
        memories = self.cur.fetchall()

        conversation_history = ""
        for user_msg, bot_msg in memories:
            conversation_history += f"User: {user_msg}\nAssistant: {bot_msg}\n"

        return conversation_history

    def get_last5_memory(self, thread_id: int, max_memories=5):
        # Ensure table exists
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id SERIAL PRIMARY KEY,
                thread_id INTEGER,
                prompt TEXT,
                response TEXT,
                created_at TIMESTAMP DEFAULT now()
            );
        """)
        self.conn.commit()

        # Fetch last N messages (most recent first) for this thread
        self.cur.execute("""
            SELECT prompt, response
            FROM memories
            WHERE thread_id = %s
            ORDER BY id DESC
            LIMIT %s;
        """, (thread_id, max_memories))

        memories = self.cur.fetchall()

        # Reverse so conversation flows old -> new
        memories.reverse()

        conversation_history = ""
        for user_msg, bot_msg in memories:
            conversation_history += (
                f"User: {user_msg}\n"
                f"Assistant: {bot_msg}\n"
            )

        return conversation_history


    def close(self):
        self.cur.close()
        self.conn.close()   


if __name__ == "__main__":
    stm_manager = STMManager()
    memories = stm_manager.get_memory(thread_id=0)
    conversation_history = ""
    for idx, memory in enumerate(memories):
        # memory structure: (id, prompt, response)
        user_msg = memory[1]  # prompt column
        bot_msg = memory[2]   # response column
        conversation_history += f"User: {user_msg}\nAssistant: {bot_msg}\n"

    print(conversation_history)
    stm_manager.close()
    
