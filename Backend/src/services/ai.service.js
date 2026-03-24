const {GoogleGenAI} = require('@google/genai')
const {z} = require("zod")
const { zodToJsonSchema } = require('zod-to-json-schema')

// const{resume, selfDescription, jobDescription} = require('../temp')

const ai = new GoogleGenAI({
  apiKey : process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's resume and self-description match the job description"),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("The technical question can be ask during the interview"),
    intention: z.string().describe("The intention of interviewer behind asking the technical question"),
    answer: z.string().describe("How to answer this question, what points to be cover, what approach to be followed")
  })).describe("List of technical questions that can be asked during the interview, along with the intention behind asking those questions and how to answer them"),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("The behavioral question can be ask during the interview"),
    intention: z.string().describe("The intention of interviewer behind asking the behavioral question"),
    answer: z.string().describe("How to answer this question, what points to be cover, what approach to be followed")
  })).describe("List of behavioral questions that can be asked during the interview, along with the intention behind asking those questions and how to answer them"),
  skillGaps: z.array(z.object({
    skill: z.string().describe("The skill in which the candidate is lacking"),
    severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
  })).describe("List of skill gaps that the candidate has, along with the severity of each skill gap"),
  preparationPlan: z.array(z.object({
    day: z.number().describe("The day number of the preparation plan"),
    focus: z.string().describe("The main focus of the preparation for that day"),
    tasks: z.array(z.string()).describe("The list of tasks to be done on that day for preparation")
  })).describe("A detailed 7-day preparation plan for the candidate to prepare for the interview, based on the identified skill gaps and the job description"),
  title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({resume, selfDescription, jobDescription}){
   
 const prompt = `Generate a detailed interview report for a candidate based on the following information:

Resume: ${resume}
Self-Description: ${selfDescription}
Job Description: ${jobDescription}

STRICT INSTRUCTIONS:

You MUST return output strictly in JSON format.

Follow this EXACT structure:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": "string",
      "tasks": ["string"]
    }
  ]
}

VERY IMPORTANT:

- technicalQuestions MUST be an array of OBJECTS (not strings)
- behavioralQuestions MUST be an array of OBJECTS (not strings)
- skillGaps MUST be an array of OBJECTS (not strings)
- preparationPlan MUST be an array of OBJECTS (not strings)

WRONG FORMAT EXAMPLE (DO NOT DO THIS):
"technicalQuestions": ["question", "intention", "answer"]

CORRECT FORMAT EXAMPLE:
"technicalQuestions": [
  {
    "question": "Explain closures in JavaScript",
    "intention": "To test understanding of scope",
    "answer": "Explain lexical scope with example"
  }
]

MANDATORY RULES:

- Include at least 3 technical questions
- Include at least 3 behavioral questions
- Preparation plan MUST have exactly 7 days
- Each day must include multiple tasks
- Skill gaps must be realistic

STRICT OUTPUT RULES:

- Do NOT add extra fields
- Do NOT rename fields
- Do NOT return explanation
- Return ONLY valid JSON
`;

   const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // responseSchema: zodToJsonSchema(interviewReportSchema)
      
    },

   }) 
  //  console.log(response.text);
   const parsed = JSON.parse(response.text);
   return parsed;
   
}

module.exports = generateInterviewReport;