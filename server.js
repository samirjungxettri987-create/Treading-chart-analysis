import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const app=express();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024}});
app.use(express.static('public'));
app.post('/api/analyze',upload.single('chart'),async(req,res)=>{
  try{
    if(!req.file) return res.status(400).json({error:'Chart image is required.'});
    if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:'AI backend is not configured. Add OPENAI_API_KEY on the server.'});
    const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const lang=req.body.language==='ne'?'Nepali':'English';
    const system=`You are a disciplined trading chart analysis engine. Analyze ONLY what is visibly supported by the uploaded chart. Strategy is strictly Trend + Pullback + Closed-Candle Confirmation. Identify trend, HH/HL/LH/LL, latest swing high/low, confirmed BOS/CHoCH only, support/resistance, setup type, and closed-candle confirmation. Never invent price levels. If any required confirmation is missing or unreadable, signal MUST be WAIT. Provide entry/SL/TP only when the chart visibly supports them. News risk is contextual and must never force a trade. Do not claim 100% accuracy or guaranteed profit. Return valid JSON only with keys: signal, confidence, trend, structure, latestSwing, bosChoch, supportResistance, setup, confirmation, entryZone, stopLoss, tp1, tp2, riskReward, invalidation, newsRisk, reasons, whatToDo, whatNotToDo, language. Explain in ${lang}. Confidence is an estimate of setup quality, not win probability.`;
    const dataUrl=`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const r=await client.responses.create({model:'gpt-6-luna',input:[{role:'system',content:system},{role:'user',content:[{type:'input_text',text:'Analyze this trading screenshot. Be conservative and choose WAIT when evidence is incomplete.'},{type:'input_image',image_url:dataUrl,detail:'high'}]}],text:{format:{type:'json_object'}}});
    const parsed=JSON.parse(r.output_text);
    res.json(parsed);
  }catch(e){res.status(500).json({error:e.message||'Analysis failed.'});}
});
app.get('*',(req,res)=>res.sendFile(process.cwd()+'/public/index.html'));
app.listen(process.env.PORT||3000,()=>console.log('Trading Chart Analyzer running'));
