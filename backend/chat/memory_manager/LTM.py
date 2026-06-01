#long term memory manager

import ollama
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
from memory_manager.STM import STMManager
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field
from typing import List
from rank_bm25 import BM25Okapi
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize

class Fact(BaseModel):
    fact: str = Field(description="A single atomic, important fact about the user.")

class FactList(BaseModel):
    facts: List[Fact] = Field(description="A list of important facts extracted from the conversation.")


class LTMHelper():
    def __init__(self):
        self.stm_manager = STMManager()

    def text_to_embedding(self, text: str) -> list[float]:
        response = ollama.embeddings(
            model="nomic-embed-text",
            prompt=text
        )
        return response["embedding"]

    def prompt_template(self, thread_id: int) -> str:
        previous_memories = self.stm_manager.get_last5_memory(thread_id)
        prompt = f"""
            TASK: EXTRACT ALL REALLY IMPORTANT FACTS FROM THE RECENT MEMORY.
            
            IMPORTANT: EXTRACT ALL FACTS that are relevant for long-term understanding of the user. Be thorough and capture EVERYTHING that matters.
            
            RECENT MEMORY:
            {previous_memories}
        """
        return prompt

    def bm25_rerank(self, query, documents, top_n=5):
        if not documents:
            return []

        if not isinstance(query, str):
            raise ValueError("BM25 query must be a string")

        tokenized_docs = [word_tokenize(doc.lower()) for doc in documents]
        bm25 = BM25Okapi(tokenized_docs)

        tokenized_query = word_tokenize(query.lower())
        scores = bm25.get_scores(tokenized_query)

        ranked = sorted(zip(documents, scores), key=lambda x: x[1], reverse=True)
        return [doc for doc, _ in ranked[:top_n]]
    


class LTMManager(LTMHelper):
    def __init__(self):
        super().__init__()
        self.conn = psycopg2.connect(
            host="localhost",
            port=5433,
            database="postgres",
            user="postgres",
            password=os.getenv("POSTGRES_PASSWORD")
        )
        self.conn.autocommit = True
        self.cur = self.conn.cursor()

    def storeFacts(self, fact: str)->str:
        """
        Store extracted facts and their embeddings into the PostgreSQL database. cell by cell.
        """
        embedding= self.text_to_embedding(fact)
        query = """
            INSERT INTO facts (fact, fact_embedding)
            VALUES (%s, %s)
        """
        self.cur.execute(query, (fact, embedding))
        self.conn.commit()
        return "Fact stored."

    def extractFacts(self, thread_id: int):
        llm = ChatOllama(
            model="qwen3:4b",
            temperature=0,
        )
        
        # Use structured output with Pydantic
        structured_llm = llm.with_structured_output(FactList)
        
        system_prompt = ("""You are an expert LONG-TERM MEMORY EXTRACTION AGENT.
            Your job is to identify and extract EVERY IMPORTANT FACT from the conversation that is worth remembering.
            
            Focus on:
            - User identity (name, location, role, profession)
            - Stable preferences (likes, dislikes, interests)
            - Ongoing projects, specific goals, or tasks the user is working on
            - Skills, tools, technical stack, or expertise mentioned
            - Persistent constraints, habits, or requirements
            - Significant life events or background information
            
            Extraction Rules:
            - Extract ALL facts that meet the criteria. Don't miss any.
            - Ensure facts are 'really important' for future interactions.
            - Format each fact as a clear, atomic, short sentence.
            - Do NOT extract emotions, temporary states, or trivial chatty text.
            - If no important facts are found, return an empty list."""
        )
        
        prompt = self.prompt_template(thread_id)
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=prompt)
        ]

        result = structured_llm.invoke(messages)
        
        # Store each extracted fact
        if result and result.facts:
            for fact_obj in result.facts:
                self.storeFacts(fact_obj.fact)
            return f"Extracted and stored {len(result.facts)} facts."
        
        return "No new important facts extracted."

    def ragExtract(self,query: str, top_k: int = 5):
        query_embedding = self.text_to_embedding(query)

        sql = """
            SELECT
                fact,
                1 - (fact_embedding <=> %s::vector) AS similarity
            FROM facts
            ORDER BY fact_embedding <=> %s::vector
            LIMIT %s
        """

        self.cur.execute(sql, (query_embedding, query_embedding, top_k))
        rows = self.cur.fetchall()

        return [row[0] for row in rows]

    def rag_bm25ExtractFact(self,query: str, top_k: int = 5, top_n: int = 3):
        self.cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        self.cur.execute("""
            CREATE TABLE IF NOT EXISTS facts (
                id SERIAL PRIMARY KEY,
                fact TEXT NOT NULL,
                fact_embedding VECTOR(768),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );        
        """)
        retrieved_docs = self.ragExtract(query, top_k=top_k)
        reranked_docs = self.bm25_rerank(query, retrieved_docs, top_n=top_n)
        convo_facts=""
        for doc in reranked_docs:
            convo_facts+=doc+"\n"
        return convo_facts




if __name__ == "__main__":
    obj=LTMManager()
    print(obj.extractFacts(0))
