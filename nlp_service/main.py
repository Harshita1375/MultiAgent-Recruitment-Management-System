from fastapi import FastAPI, UploadFile, File, Form
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import io

app = FastAPI()

@app.post("/api/ats/rank")
async def rank_resumes(jd: str = Form(...), resumes: list[UploadFile] = File(...)):
    results = []
    for resume in resumes:
        # Extract text from PDF
        pdf = PyPDF2.PdfReader(io.BytesIO(await resume.read()))
        text = " ".join([page.extract_text() for page in pdf.pages])
        
        # Calculate Cosine Similarity
        tfidf = TfidfVectorizer().fit_transform([jd, text])
        score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        
        results.append({
            "filename": resume.filename,
            "score": round(score * 100, 2)
        })
    return sorted(results, key=lambda x: x['score'], reverse=True)