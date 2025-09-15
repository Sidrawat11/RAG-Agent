from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from pydantic import BaseModel
from langchain_community.vectorstores import Pinecone
from langchain_community.llms import HuggingFaceHub
from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pinecone
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

class Question(BaseModel):
    question: str

class Chatbot():
    # Here Goes the Code
    def __init__(self):
        # Set the Encoding to Auto-Detect
        text_loader_kwargs={'autodetect_encoding': True}

        # Load the Documents
        loader = DirectoryLoader('./Documents', glob="**/*.txt", show_progress=True, loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)
        documents = loader.load()
        
        # Split into manageable chunks, Size = 1000 Chars and Overlap = 200 words (20% Overlap, for efficiency can change later)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        docs = text_splitter.split_documents(documents)
    

        # Using Hugging face Embeddings
        embeddings = HuggingFaceEmbeddings()

        # Initialize Pinecone Client
        pinecone.init(
            api_key= os.getenv('PINECONE_API_KEY'),
            environment='gcp-starter'
        )

        # Defining Index
        index_name = "langchain-bot"
    
        # Checking Index
        if index_name not in pinecone.list_indexes():
            # Create new Index, Dimension=768 according to HuggingFace Capabilities
            pinecone.create_index(name=index_name, metric="cosine", dimension=768)
            docsearch = Pinecone.from_documents(documents=docs, embedding=embeddings, index_name=index_name)
        else:
            # Link to existing index
            docsearch = Pinecone.from_existing_index(index_name, embeddings)

        self.llm = ChatOllama(model="llama3", temperature=0.6, top_k=3)

        # Generating Prompt Template
        template =template = """
                            You are an expert specializing in Intel QAT (QuickAssist Technology). People will ask you questions about Intel QAT.
                            Use the following piece of context to answer the question professionally and accurately. If you don't know the answer, just say "I don't know".

                            Context: {context}
                            Question: {question}
                            Answer:
                            """

        self.prompt = PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )

        self.retriever = docsearch.as_retriever()

    def format_docs(self, documents):
            return "\n\n".join(doc.page_content for doc in documents)
        
    def get_answer(self, question):
        # Building the RAG Pipeline
        rag_chain = (
            {"context": self.retriever | self.format_docs, "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )
        return rag_chain.invoke(question)

chatbot = Chatbot()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ask")
def ask_question(question: Question):
     try:
          answer = chatbot.get_answer(question.question)
          return {"answer" : answer}
     except Exception as e:
          return HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
     uvicorn.run(app, host="0.0.0.0", port=8000)