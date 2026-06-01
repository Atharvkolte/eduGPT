import datetime
from unittest import result
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from langchain.agents import create_agent
from memory_manager import STMManager,LTMManager
from tools import (
    get_weather,
)


# -------------------- OLLAMA GPT --------------------
class OllamaGpt:
    def __init__(self):
        self.llm = ChatOllama(
            model="qwen3:1.7b",
            temperature=0.7,
            #base_url="http://host.docker.internal:11434"
        )

        self.tools = [
            get_weather
        ]
        self.agent = create_agent(self.llm, tools=self.tools)

        self.system_prompt = (
            "You are Professor Alex, an experienced and engaging college professor who teaches any subject "
            "to undergraduate students aged 18-22.\n\n"

            "YOUR TEACHING PERSONALITY:\n"
            "- Friendly, approachable, and enthusiastic about every subject.\n"
            "- Use casual academic tone — not too formal, not too loose.\n"
            "- Encourage curiosity. Never make a student feel dumb for asking anything.\n"
            "- Use relatable analogies (pop culture, tech, daily life) to explain complex ideas.\n"

            "HOW YOU TEACH:\n"
            "- Break down complex topics into digestible chunks. Start simple, build up.\n"
            "- Use the Socratic method occasionally — ask the student a follow-up question "
            "to make them think deeper.\n"
            "- When explaining a concept, follow this pattern: "
            "Explain → Give a real-world example → Ask the student to apply it.\n"
            "- If a student seems stuck, offer hints rather than giving the full answer directly.\n"

            "BRAINSTORMING MODE:\n"
            "- When a student wants to brainstorm, act as a thinking partner.\n"
            "- Build on their ideas enthusiastically. Say things like 'What if we take that further...' "
            "or 'That reminds me of a concept called...'\n"
            "- Help them organize scattered thoughts into structured ideas.\n"
            "- Never shoot down an idea — redirect it constructively.\n"

            "MEMORY RULES:\n"
            "- Treat explicit student statements about themselves as FACTS.\n"
            "- Remember their learning progress, struggles, and interests across the conversation.\n"
            "- If the student mentioned a topic they find hard before, acknowledge it gently.\n"

            "RESPONSE STYLE:\n"
            "- Keep responses concise but complete — no walls of text.\n"
            "- Use bullet points, numbered steps, or short paragraphs to stay readable.\n"
            "- End responses with either a question, a challenge, or a 'next step' to keep momentum.\n"
            "- Occasionally use light humor to keep things engaging.\n"
        )
        self.stm_manager = STMManager()
        self.ltm_manager = LTMManager()
        self.counterFacts=0


    def prompt_template(self, user_input: str, thread_id=0) -> str:
        summary = self.stm_manager.get_latest_summary(thread_id)
        previous_memories = self.stm_manager.get_last5_memory(thread_id)
        prompt = f"""
            You are an AI assistant continuing an ongoing conversation.

            USERS FACTS FROM PREVIOUS CONVORSATION:
            {self.ltm_manager.rag_bm25ExtractFact(user_input, 5, 3)}
            
            ### Conversation Summary (High-level, authoritative)
            {summary}

            ### Recent Conversation Memory (Last 5 turns, may be incomplete)
            {previous_memories}

            ### Current User Input
            {user_input}

            ### Instructions
            - Use the summary as the primary source of truth.
            - Use recent memory only if relevant.
            - Respond clearly and helpfully.
        """

        return prompt

    def generate_response(self, user_input: str, thread_id=0)->str:
        prompt = self.prompt_template(user_input, thread_id)
        #prompt = user_input
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=prompt)
        ]

        result = self.agent.invoke({"messages": messages})
        response=result["messages"][-1].content
        
        self.commandToExecute(user_input, response, thread_id)

        return response

    def commandToExecute(self, user_input: str, response: str, thread_id=0):
        self.stm_manager.create_memory_table(user_input, response, thread_id)
        self.counterFacts+=1
        if self.counterFacts%5==0:
            self.counterFacts=0
            self.ltm_manager.extractFacts(thread_id)


# -------------------- MAIN --------------------
def main():
    bot = OllamaGpt()
    print("🤖 OllamaGPT running with qwen3:4b")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break

        response = bot.generate_response(user_input,thread_id=0)
        print("Bot:", response)
        print("-" * 40)

    bot.stm_manager.close()

if __name__ == "__main__":
    main()
