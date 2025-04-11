from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


# Download NLTK resources if not already downloaded
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

# Define the FastAPI app
app = FastAPI(
    title="Indian Workplace Complaint Classifier API",
    description="API for classifying workplace complaints into categories and recommending appropriate government departments",
    version="1.0.0"
)

# Define the request model
class ComplaintRequest(BaseModel):
    complaint_text: str

# Define the response model
class ComplaintResponse(BaseModel):
    category: str
    category_confidence: float
    alternative_categories: List[Dict[str, Any]]
    recommended_department: str
    keywords_found: Optional[List[str]] = []
    explanation: Dict[str, str]

# Direct mapping from categories to primary departments
category_to_department = {
    'Wage Issues': 'Ministry of Labour and Employment - Wage Division',
    'Discrimination': 'National Commission for Women/Minorities/SC/ST (based on case)',
    'Unsafe Working Conditions': 'Directorate General of Factory Advice Service and Labour Institutes',
    'Labor Rights Violations': 'Ministry of Labour and Employment - Industrial Relations Division',
    'Workplace Harassment': 'Ministry of Women and Child Development/Local Complaints Committee',
    'Social Security Concerns': 'Ministry of Labour and Employment - Social Security Division',
    'Migrant Worker Issues': 'Ministry of Labour and Employment - Inter-State Migrant Workers Division'
}

# Keyword to department mapping for more specific routing
keyword_to_department = {
    'salary': 'Ministry of Labour and Employment - Wage Division',
    'wage': 'Ministry of Labour and Employment - Wage Division',
    'payment': 'Ministry of Labour and Employment - Wage Division',
    'bonus': 'Ministry of Labour and Employment - Wage Division',
    'overtime': 'Ministry of Labour and Employment - Wage Division',
    
    'pf': 'Employees Provident Fund Organisation',
    'provident fund': 'Employees Provident Fund Organisation',
    'epf': 'Employees Provident Fund Organisation',
    
    'esi': 'Employees State Insurance Corporation',
    'medical benefit': 'Employees State Insurance Corporation',
    'health insurance': 'Employees State Insurance Corporation',
    
    'safety': 'Directorate General of Factory Advice Service and Labour Institutes',
    'hazard': 'Directorate General of Factory Advice Service and Labour Institutes',
    'accident': 'Directorate General of Factory Advice Service and Labour Institutes',
    'fire': 'State Fire Department and Labour Department',
    
    'sexual harassment': 'Internal Complaints Committee/Local Complaints Committee',
    'gender discrimination': 'National Commission for Women',
    'caste discrimination': 'National Commission for Scheduled Castes/Tribes',
    'religious discrimination': 'National Commission for Minorities',
    'disability': 'Chief Commissioner for Persons with Disabilities',
    
    'contract': 'Ministry of Labour and Employment - Industrial Relations Division',
    'termination': 'Ministry of Labour and Employment - Industrial Relations Division',
    'resignation': 'Ministry of Labour and Employment - Industrial Relations Division',
    'union': 'Ministry of Labour and Employment - Industrial Relations Division',
    'leave': 'Ministry of Labour and Employment - Industrial Relations Division',
    
    'migrant': 'Ministry of Labour and Employment - Inter-State Migrant Workers Division',
    'interstate': 'Ministry of Labour and Employment - Inter-State Migrant Workers Division',
    'housing': 'Ministry of Housing and Urban Affairs',
    
    'pension': 'Employees Provident Fund Organisation',
    'gratuity': 'Ministry of Labour and Employment - Industrial Relations Division',
    
    'child labor': 'Ministry of Labour and Employment - Child Labor Division',
    'maternity': 'Ministry of Women and Child Development'
}

# Text preprocessing function
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters but keep some punctuation
    text = re.sub(r'[^a-zA-Z\s\.\,]', '', text)
    
    # Tokenize text
    tokens = nltk.word_tokenize(text)
    
    # Create custom stopwords - keeping some important words that might be relevant
    custom_stopwords = set(stopwords.words('english')) - {'no', 'not', 'against', 'below', 'above', 'under', 'over', 'without', 'with'}
    
    # Remove stopwords
    tokens = [word for word in tokens if word not in custom_stopwords]
    
    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
    # Join tokens back into text
    preprocessed_text = ' '.join(tokens)
    
    return preprocessed_text

# Function for identifying keywords in complaint text
def identify_keywords(text, keyword_dict):
    text = text.lower()
    found_keywords = []
    
    for keyword in keyword_dict.keys():
        if keyword in text:
            found_keywords.append(keyword)
    
    return found_keywords

# Function to determine department based on category and keywords
def determine_department(category, complaint_text):
    # Primary department based on category
    primary_dept = category_to_department.get(category, "Unknown Department")
    
    # Check for specific keywords that might override the default department
    found_keywords = identify_keywords(complaint_text.lower(), keyword_to_department)
    
    if found_keywords:
        # Count occurrences of departments based on found keywords
        dept_counts = {}
        for keyword in found_keywords:
            dept = keyword_to_department[keyword]
            dept_counts[dept] = dept_counts.get(dept, 0) + 1
        
        # If a specific department is strongly indicated by keywords, use it
        max_count = max(dept_counts.values()) if dept_counts else 0
        max_depts = [dept for dept, count in dept_counts.items() if count == max_count]
        
        if max_count >= 2 and len(max_depts) == 1:
            return max_depts[0], found_keywords
    
    # Default to category-based department if no strong keyword match
    return primary_dept, found_keywords

# Load the model at startup
try:
    category_model = pickle.load(open('category_classifier_model.pkl', 'rb'))
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    category_model = None

@app.on_event("startup")
async def startup_event():
    # Additional startup tasks can go here
    pass

@app.get("/")
def read_root():
    return {"message": "Indian Workplace Complaint Classifier API is running!"}

@app.get("/health")
def health_check():
    if category_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "healthy"}

@app.post("/classify", response_model=ComplaintResponse)
def classify_complaint(request: ComplaintRequest):
    if category_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not request.complaint_text.strip():
        raise HTTPException(status_code=400, detail="Complaint text cannot be empty")
    
    try:
        # Preprocess the complaint text
        preprocessed = preprocess_text(request.complaint_text)
        
        # Predict category
        category = category_model.predict([preprocessed])[0]
        category_proba = category_model.predict_proba([preprocessed])[0]
        category_confidence = float(max(category_proba))  # Convert numpy float to Python float for JSON serialization
        
        # Get top 3 categories
        category_indices = category_proba.argsort()[-3:][::-1]
        category_classes = category_model.classes_
        top_categories = [{"category": category_classes[i], "confidence": float(category_proba[i])} for i in category_indices]
        alternative_categories = top_categories[1:] if len(top_categories) > 1 else []
        
        # Determine department based on category and keywords
        recommended_department, keywords_found = determine_department(category, request.complaint_text)
        
        # Generate explanation
        category_explanation = f"This complaint is classified as '{category}' because it contains terms commonly associated with {category.lower()} issues."
        department_explanation = f"Based on the category '{category}', this complaint should be directed to '{recommended_department}'."
        
        if keywords_found:
            department_explanation += f" This recommendation is supported by specific keywords found in the complaint: {', '.join(keywords_found)}."
        
        return {
            "category": category,
            "category_confidence": category_confidence,
            "alternative_categories": alternative_categories,
            "recommended_department": recommended_department,
            "keywords_found": keywords_found,
            "explanation": {
                "category": category_explanation,
                "department": department_explanation
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing complaint: {str(e)}")

@app.get("/categories")
def get_categories():
    return {"categories": list(category_to_department.keys())}

@app.get("/departments")
def get_departments():
    return {"departments": sorted(set(category_to_department.values()))}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)