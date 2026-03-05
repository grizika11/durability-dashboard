import { useState, useRef, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { supabase } from "./lib/supabase";

// ─── FALLBACK DATA (used when Supabase is unavailable) ───────────────────────
const FALLBACK_DB = {
  athletes: [
    { id:"49ca8f8e-00dc-4582-a92e-58212121f777", first_name:"Gabby",     last_name:"Rizika",      assessmentCount:265, latestScore:0.62, firstScore:0.59, lastDate:"2026-03-05T02:44:10Z", history:[0.53,0.59,0.64,0.72,0.69,0.62] },
    { id:"0812572d-48a9-40c9-bff8-bd5afc289d7d", first_name:"Hannah",    last_name:"Steadman",    assessmentCount:11,  latestScore:0.72, firstScore:0.74, lastDate:"2026-03-04T16:38:20Z", history:[0.74,0.73,0.72,0.73,0.72] },
    { id:"818c56b1-a2fe-4e01-aab6-1e33e08ebc22", first_name:"Steph",     last_name:"Xu",          assessmentCount:24,  latestScore:0.54, firstScore:0.67, lastDate:"2026-03-04T03:48:53Z", history:[0.67,0.63,0.60,0.57,0.54] },
    { id:"61a94c84-4fd4-45ed-9f25-3f717e36abfb", first_name:"Annabelle", last_name:"Hutchinson",  assessmentCount:1,   latestScore:0.72, firstScore:0.72, lastDate:"2026-02-19T15:22:56Z", history:[0.72] },
    { id:"932ff2dd-f803-4322-8688-f395ce4afe7a", first_name:"Jack",      last_name:"O'Brien",     assessmentCount:1,   latestScore:0.41, firstScore:0.41, lastDate:"2026-02-12T03:25:08Z", history:[0.41] },
    { id:"c2c97de8-affe-42c1-8c1a-fba9f5b99c3c", first_name:"Drew",      last_name:"Adams",       assessmentCount:4,   latestScore:0.64, firstScore:0.64, lastDate:"2026-02-11T19:32:40Z", history:[0.64,0.64,0.64,0.64] },
    { id:"4c1f3ab0-d73c-49e9-be1a-31a0b2677ea4", first_name:"Amaury",    last_name:"De Bock",     assessmentCount:5,   latestScore:0.70, firstScore:0.86, lastDate:"2026-01-21T17:02:37Z", history:[0.86,0.80,0.76,0.72,0.70] },
    { id:"50887f9a-988f-44fe-9274-29b0d805a5ad", first_name:"Blake",     last_name:"Blaze",       assessmentCount:0,   latestScore:null, firstScore:null, lastDate:null,                   history:[] },
    { id:"946748b5-944f-44f6-b9b3-bf5bdb736e24", first_name:"Aaron",     last_name:"Win",         assessmentCount:0,   latestScore:null, firstScore:null, lastDate:null,                   history:[] },
    { id:"13370a40-2061-425a-aed9-698cd85b90da", first_name:"Maria",     last_name:"Guerrero R",  assessmentCount:0,   latestScore:null, firstScore:null, lastDate:null,                   history:[] },
  ],

  // Gabby — 6 most recent full assessments
  assessments: {
    "49ca8f8e-00dc-4582-a92e-58212121f777": [
      { id:"52c169f9-d5f6-487f-9981-c0199d879aa1", created_at:"2026-03-05T02:44:10Z", durability_score:0.62, shoulder_score:0.60, hips_score:0.68, knee_score:0.77, ankle_score:0.85, core_score:0.72, lower_back_score:0.58, chest_score:0.65, arms_score:0.70, range_of_motion_score:0.57, flexibility_score:0.59, mobility_score:0.66, functional_strength_score:0.67 },
      { id:"e0bca5b7-9e54-45cc-98b0-59b1dc89b6c8", created_at:"2026-03-05T01:49:25Z", durability_score:0.69, shoulder_score:0.71, hips_score:0.73, knee_score:0.86, ankle_score:0.87, core_score:0.71, lower_back_score:0.58, chest_score:0.76, arms_score:0.72, range_of_motion_score:0.61, flexibility_score:0.63, mobility_score:0.72, functional_strength_score:0.74 },
      { id:"28887196-7e0f-44f0-9321-62cf2c5063e4", created_at:"2026-03-05T00:37:06Z", durability_score:0.72, shoulder_score:0.69, hips_score:0.81, knee_score:0.91, ankle_score:0.85, core_score:0.83, lower_back_score:0.67, chest_score:0.77, arms_score:0.74, range_of_motion_score:0.64, flexibility_score:0.67, mobility_score:0.78, functional_strength_score:0.73 },
      { id:"907aae22-bc7b-4a35-a9ee-8bbb0353da49", created_at:"2026-03-04T23:12:11Z", durability_score:0.64, shoulder_score:0.66, hips_score:0.66, knee_score:0.75, ankle_score:0.91, core_score:0.73, lower_back_score:0.64, chest_score:0.69, arms_score:0.66, range_of_motion_score:0.58, flexibility_score:0.60, mobility_score:0.69, functional_strength_score:0.65 },
      { id:"b225cbf4-a57b-4dd8-9eb3-d41aded4f6dd", created_at:"2026-03-04T21:59:40Z", durability_score:0.59, shoulder_score:0.53, hips_score:0.67, knee_score:0.69, ankle_score:0.83, core_score:0.70, lower_back_score:0.62, chest_score:0.56, arms_score:0.58, range_of_motion_score:0.55, flexibility_score:0.56, mobility_score:0.63, functional_strength_score:0.59 },
      { id:"4c7f0ded-5367-4bb1-921f-9ca02de70c6e", created_at:"2026-03-04T21:33:11Z", durability_score:0.53, shoulder_score:0.46, hips_score:0.53, knee_score:0.79, ankle_score:0.85, core_score:0.72, lower_back_score:0.59, chest_score:0.53, arms_score:0.54, range_of_motion_score:0.46, flexibility_score:0.46, mobility_score:0.54, functional_strength_score:0.60 },
    ],
  },

  exercises: {
    "52c169f9-d5f6-487f-9981-c0199d879aa1": [
      { name:"Overhead Squat",             reps:[0.516,0.655,0.716], nuances:["Torso lean 34–38°","Squat depth 80°+","Valgus","Hip shift","Bilateral foot splay"], angles:[{id:"spine",mean:36.2,max:40,min:14},{id:"left-hip",mean:85.0,max:90,min:20},{id:"right-hip",mean:83.4,max:91,min:22},{id:"left-knee",mean:86.1,max:95,min:30},{id:"right-knee",mean:87.8,max:100,min:32}] },
      { name:"Shoulder Abduction",         reps:[0.320,0.320,0.320], nuances:["100°+ both shoulders — did not clear 120°"], angles:[{id:"right-shoulder-abduction",mean:108,max:110,min:41},{id:"left-shoulder-abduction",mean:110,max:114,min:43}] },
      { name:"Bilateral Shoulder Flexion", reps:[0.750,0.564,0.750], nuances:["Full flexion reps 0 & 2","Head rotation rep 1"], angles:[{id:"left-shoulder",mean:177.7,max:180,min:90},{id:"right-shoulder",mean:180.0,max:180,min:105}] },
      { name:"Push-Up",                    reps:[0.699,0.850,0.850], nuances:["Full lockout","Chest to floor"], angles:[] },
      { name:"Forward Fold",               reps:[0.549,0.736,0.736], nuances:["Mid-shin reach","Slight knee bend"], angles:[] },
      { name:"Forward Lunge",              reps:[0.800,0.593,0.800], nuances:["Left lateral balance loss","Both back knees near floor"], angles:[{id:"right-hip-hinge",mean:81.3,max:86,min:17},{id:"left-hip-hinge",mean:84.0,max:87,min:33},{id:"spine-angle",mean:15.0,max:17,min:6}] },
      { name:"Standing Back Extension",    reps:[0.323,0.450,0.450], nuances:["Shins forward","10°+ extension","Hands on back"], angles:[{id:"backward-extension",mean:14.0,max:17,min:6},{id:"left-knee-bend",mean:14.0,max:15,min:10},{id:"right-knee-bend",mean:14.3,max:15,min:12}] },
    ],
    "e0bca5b7-9e54-45cc-98b0-59b1dc89b6c8": [
      { name:"Overhead Squat",             reps:[0.516,0.750,0.750], nuances:["Torso lean 32–34°","Depth 80°+","Right arm deficit","Lateral hip shift","Bilateral foot splay"], angles:[{id:"spine",mean:34.3,max:36,min:16},{id:"left-hip",mean:84.3,max:86,min:19},{id:"right-hip",mean:82.7,max:84,min:24},{id:"left-knee",mean:81.7,max:83,min:29},{id:"right-knee",mean:83.7,max:87,min:35},{id:"left-ankle",mean:36.0,max:37,min:28},{id:"right-ankle",mean:33.7,max:34,min:25}] },
      { name:"Shoulder Abduction",         reps:[0.320,0.320,0.480], nuances:["Both shoulders 100°+","Left cleared 120° on rep 2"], angles:[{id:"right-shoulder-abduction",mean:115.3,max:124,min:43},{id:"left-shoulder-abduction",mean:122.0,max:133,min:44}] },
      { name:"Bilateral Shoulder Flexion", reps:[0.750,0.564,0.750], nuances:["Full flexion both arms","Head rotation right on rep 1"], angles:[{id:"left-shoulder",mean:177.7,max:180,min:90},{id:"right-shoulder",mean:180.0,max:180,min:105}] },
      { name:"Push-Up",                    reps:[0.699,1.000,1.000], nuances:["Full lockout","Chest to floor"], angles:[] },
      { name:"Forward Fold",               reps:[0.775,0.736,0.736], nuances:["Lower shin reach","Slight knee bend"], angles:[] },
      { name:"Forward Lunge",              reps:[0.800,0.593,0.800], nuances:["Left lateral balance loss","Both back knees near floor"], angles:[{id:"right-hip-hinge",mean:81.3,max:86,min:17},{id:"left-hip-hinge",mean:84.0,max:87,min:33},{id:"spine-angle",mean:15.0,max:17,min:6}] },
      { name:"Standing Back Extension",    reps:[0.323,0.450,0.450], nuances:["Shins forward","10°+ extension","Hands on back"], angles:[{id:"backward-extension",mean:14.0,max:17,min:6},{id:"left-knee-bend",mean:14.0,max:15,min:10},{id:"right-knee-bend",mean:14.3,max:15,min:12}] },
    ],
    "28887196-7e0f-44f0-9321-62cf2c5063e4": [
      { name:"Overhead Squat",             reps:[0.486,0.750,0.748], nuances:["Torso lean 34–38°","Depth 80–90°","Right arm deficit","Valgus","Right foot splay"], angles:[{id:"spine",mean:37.7,max:39,min:15},{id:"left-hip",mean:86.7,max:91,min:17},{id:"right-hip",mean:87.0,max:92,min:24},{id:"left-knee",mean:89.3,max:94,min:28},{id:"right-knee",mean:94.0,max:100,min:35}] },
      { name:"Shoulder Abduction",         reps:[0.480,0.320,0.320], nuances:["Both 100°+","Left 120°+ on rep 0 only"], angles:[{id:"right-shoulder-abduction",mean:106.3,max:107,min:42},{id:"left-shoulder-abduction",mean:116.7,max:121,min:43}] },
      { name:"Bilateral Shoulder Flexion", reps:[0.750,0.750,0.386], nuances:["Full flexion reps 0–1","Arms wide rep 2"], angles:[{id:"left-shoulder",mean:179.7,max:180,min:99},{id:"right-shoulder",mean:180.0,max:180,min:106}] },
      { name:"Push-Up",                    reps:[0.699,1.000,1.000], nuances:["Full lockout","Chest to floor"], angles:[] },
      { name:"Forward Fold",               reps:[0.950,0.950,0.950], nuances:["Best session — feet flat, no deductions"], angles:[] },
      { name:"Forward Lunge",              reps:[0.800,0.800,0.593], nuances:["Right lateral balance loss rep 2","Both back knees near floor"], angles:[{id:"right-hip-hinge",mean:74.0,max:78,min:23},{id:"left-hip-hinge",mean:82.3,max:84,min:32},{id:"spine-angle",mean:13.7,max:15,min:3}] },
      { name:"Standing Back Extension",    reps:[0.323,0.617,0.450], nuances:["Shins forward","10°+ and 20°+ extension achieved"], angles:[{id:"backward-extension",mean:19.3,max:22,min:6},{id:"left-knee-bend",mean:15.0,max:18,min:9},{id:"right-knee-bend",mean:16.3,max:18,min:12}] },
    ],
    "907aae22-bc7b-4a35-a9ee-8bbb0353da49": [
      { name:"Overhead Squat",             reps:[0.555,0.590,0.716], nuances:["Torso lean 38–40°","Depth 80–100°","Right arm deficit","Hip shift","Valgus","Left foot splay"], angles:[{id:"spine",mean:39.7,max:40,min:14},{id:"left-hip",mean:88.3,max:90,min:22},{id:"right-hip",mean:90.3,max:94,min:21},{id:"left-knee",mean:89.3,max:96,min:32},{id:"right-knee",mean:92.7,max:101,min:30}] },
      { name:"Shoulder Abduction",         reps:[0.320,0.320,0.320], nuances:["100°+ only — did not clear 120°"], angles:[{id:"right-shoulder-abduction",mean:106.0,max:108,min:41},{id:"left-shoulder-abduction",mean:106.7,max:112,min:45}] },
      { name:"Bilateral Shoulder Flexion", reps:[0.600,0.750,0.750], nuances:["Full flexion reps 1–2","150°+ only rep 0"], angles:[{id:"left-shoulder",mean:177.3,max:180,min:108},{id:"right-shoulder",mean:179.7,max:180,min:107}] },
      { name:"Push-Up",                    reps:[0.699,0.688,0.612], nuances:["Full lockout","Hips too high","Too fast"], angles:[] },
      { name:"Forward Fold",               reps:[0.378,0.549,0.736], nuances:["Full squat depth rep 2","Mid-shin reach","Knee bend"], angles:[] },
      { name:"Forward Lunge",              reps:[0.800,0.800,0.800], nuances:["Both back knees near floor"], angles:[{id:"right-hip-hinge",mean:74.3,max:78,min:21},{id:"left-hip-hinge",mean:86.7,max:92,min:41}] },
      { name:"Standing Back Extension",    reps:[0.475,0.617,0.450], nuances:["Shins forward","20°+ extension"], angles:[{id:"backward-extension",mean:21.7,max:26,min:6},{id:"left-knee-bend",mean:14.7,max:17,min:6},{id:"right-knee-bend",mean:10.7,max:11,min:5}] },
    ],
    "b225cbf4-a57b-4dd8-9eb3-d41aded4f6dd": [
      { name:"Overhead Squat",             reps:[0.376,0.595,0.568], nuances:["Torso lean 34–36°","Depth 60–70° only","Both arms below 160°","Valgus","Bilateral foot splay"], angles:[{id:"spine",mean:36.0,max:37,min:26},{id:"left-hip",mean:81.3,max:82,min:46},{id:"right-hip",mean:70.7,max:76,min:19},{id:"left-knee",mean:80.7,max:82,min:55},{id:"right-knee",mean:67.0,max:72,min:18}] },
      { name:"Shoulder Abduction",         reps:[0.320,0.320,0.320], nuances:["100°+ only — well below 120°"], angles:[{id:"right-shoulder-abduction",mean:107.0,max:110,min:40},{id:"left-shoulder-abduction",mean:109.7,max:112,min:34}] },
      { name:"Bilateral Shoulder Flexion", reps:[0.309,0.309,0.750], nuances:["Full flexion rep 2 only","Right arm max 175°"], angles:[{id:"left-shoulder",mean:179.3,max:180,min:104},{id:"right-shoulder",mean:174.0,max:175,min:106}] },
      { name:"Push-Up",                    reps:[0.699,0.412,0.720], nuances:["Full lockout","Hips too high","Chest near ground"], angles:[] },
      { name:"Forward Fold",               reps:[0.549,0.830,0.549], nuances:["Feet flat","Knee bend","Slight bend only"], angles:[] },
      { name:"Forward Lunge",              reps:[0.800,0.800,0.800], nuances:["Both back knees near floor"], angles:[{id:"right-hip-hinge",mean:86.7,max:89,min:10},{id:"left-hip-hinge",mean:71.7,max:73,min:31}] },
      { name:"Standing Back Extension",    reps:[0.475,0.450,0.323], nuances:["Shins forward","30–40°+ extension achieved"], angles:[{id:"backward-extension",mean:33.0,max:49,min:5},{id:"left-knee-bend",mean:12.3,max:14,min:3},{id:"right-knee-bend",mean:19.0,max:20,min:4}] },
    ],
    "4c7f0ded-5367-4bb1-921f-9ca02de70c6e": [
      { name:"Overhead Squat",             reps:[0.480,0.516,0.516], nuances:["Balance loss","Torso lean 32°","Depth 70–80°","Right arm deficit","Hip shift"], angles:[{id:"spine",mean:27.7,max:32,min:13},{id:"left-hip",mean:78.7,max:81,min:7},{id:"right-hip",mean:77.0,max:87,min:22},{id:"left-knee",mean:77.3,max:78,min:5},{id:"right-knee",mean:77.7,max:83,min:23}] },
      { name:"Shoulder Abduction",         reps:[0.320,0.320,0.320], nuances:["90–100° range only — lowest session"], angles:[{id:"right-shoulder-abduction",mean:100.3,max:103,min:44},{id:"left-shoulder-abduction",mean:95.0,max:100,min:34}] },
      { name:"Bilateral Shoulder Flexion", reps:[0.750,0.750,0.750], nuances:["Full flexion","Arms wide"], angles:[{id:"left-shoulder",mean:177.7,max:180,min:106},{id:"right-shoulder",mean:180.0,max:180,min:104}] },
      { name:"Push-Up",                    reps:[0.412,0.699,0.699], nuances:["Full lockout","Hips too high","Chest near floor"], angles:[] },
      { name:"Forward Fold",               reps:[0.736,0.549,0.549], nuances:["Mid-shin reach","Slight bend","Too fast"], angles:[] },
      { name:"Forward Lunge",              reps:[0.800,0.800,0.800], nuances:["Both back knees near floor"], angles:[{id:"right-hip-hinge",mean:69.3,max:77,min:13},{id:"left-hip-hinge",mean:64.7,max:68,min:35}] },
      { name:"Standing Back Extension",    reps:[0.450,0.323,0.617], nuances:["Shins forward","10–30°+ extension"], angles:[{id:"backward-extension",mean:26.3,max:33,min:5},{id:"left-knee-bend",mean:16.7,max:17,min:8},{id:"right-knee-bend",mean:20.7,max:23,min:9}] },
    ],
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#f5f5f2", surface:"#ffffff", border:"rgba(0,0,0,0.07)",
  lime:"#c8e64e", limeXl:"#eaf5a8",
  ink:"#18181b", sub:"#71717a", muted:"#a1a1aa",
  radius:"18px", radiusSm:"10px",
};
const sc = s => s>=85?"#16a34a":s>=70?"#65a30d":s>=55?"#ca8a04":s>=40?"#ea580c":"#dc2626";
const sf = s => sc(s)+"14";
const pct = v => v==null?null:Math.round(parseFloat(v)*100);
const fmt = iso => !iso?"—":new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fmtT = iso => !iso?"":new Date(iso).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
const dAgo = iso => !iso?null:Math.floor((Date.now()-new Date(iso))/86400000);
const avg = a => a.length?a.reduce((x,y)=>x+y,0)/a.length:0;

const ANGLE_LABELS = {
  "spine":"Spine Lean","left-hip":"Left Hip","right-hip":"Right Hip",
  "left-knee":"Left Knee","right-knee":"Right Knee",
  "left-ankle":"Left Ankle","right-ankle":"Right Ankle",
  "left-foot-splay":"L Foot Splay","right-foot-splay":"R Foot Splay",
  "left-shoulder-abduction":"Left Shoulder","right-shoulder-abduction":"Right Shoulder",
  "left-shoulder":"L Shoulder Flex","right-shoulder":"R Shoulder Flex",
  "right-hip-hinge":"R Hip Hinge","left-hip-hinge":"L Hip Hinge",
  "spine-angle":"Spine Angle","backward-extension":"Extension",
  "left-knee-bend":"L Knee Bend","right-knee-bend":"R Knee Bend",
};

function status(l,f){
  if(!l) return "pending";
  const d=l-f;
  if(l>=0.85) return "excellent";
  if(l<0.50)  return "at-risk";
  if(d>0.04)  return "improving";
  if(d<-0.04) return "declining";
  return "stable";
}
const ST={
  improving:{color:"#16a34a",bg:"#f0fdf4",label:"Improving"},
  declining:{color:"#dc2626",bg:"#fef2f2",label:"Declining"},
  "at-risk":{color:"#ea580c",bg:"#fff7ed",label:"At Risk"},
  stable:{color:"#71717a",bg:"#f4f4f5",label:"Stable"},
  excellent:{color:"#16a34a",bg:"#f0fdf4",label:"Excellent"},
  pending:{color:"#a1a1aa",bg:"#fafafa",label:"No Data"},
};

// ─── SUPABASE DATA HOOKS ─────────────────────────────────────────────────────
function useAthletes(){
  const[athletes,setAthletes]=useState(null);
  const[loading,setLoading]=useState(true);

  async function load(){
    try {
      setLoading(true);
      const {data:profiles,error}=await supabase
        .from("profiles")
        .select("id,first_name,last_name")
        .order("first_name");
      if(error) throw error;
      if(!profiles){setLoading(false);return;}

      const {data:injRows}=await supabase
        .from("profile_injuries")
        .select("profile_id,injuries(name)")
        .in("profile_id",profiles.map(p=>p.id));
      const injuriesByProfile={};
      (injRows||[]).forEach(r=>{
        if(!injuriesByProfile[r.profile_id]) injuriesByProfile[r.profile_id]=[];
        if(r.injuries?.name) injuriesByProfile[r.profile_id].push(r.injuries.name);
      });

      const {data:assessments,error:aErr}=await supabase
        .from("assessments")
        .select("id,profile_id,created_at")
        .in("profile_id",profiles.map(p=>p.id))
        .order("created_at",{ascending:false});
      if(aErr) throw aErr;

      const countMap={},lastDateMap={},latestPerUser={};
      (assessments||[]).forEach(a=>{
        countMap[a.profile_id]=(countMap[a.profile_id]||0)+1;
        if(!lastDateMap[a.profile_id]) lastDateMap[a.profile_id]=a.created_at;
        if(!latestPerUser[a.profile_id]) latestPerUser[a.profile_id]=[];
        if(latestPerUser[a.profile_id].length<10) latestPerUser[a.profile_id].push(a.id);
      });

      const allLatestIds=Object.values(latestPerUser).flat();
      const durByAssessment={};
      if(allLatestIds.length){
        const {data:results,error:rErr}=await supabase
          .from("assessment_results")
          .select("assessment_id,durability_score")
          .in("assessment_id",allLatestIds);
        if(rErr) throw rErr;
        (results||[]).forEach(r=>{
          if(r.durability_score!=null) durByAssessment[r.assessment_id]=parseFloat(r.durability_score);
        });
      }

      const transformed=profiles.map(p=>{
        const aIds=latestPerUser[p.id]||[];
        const history=aIds.map(aId=>durByAssessment[aId]??null).filter(v=>v!=null);
        const latestScore=history.length?history[0]:null;
        const firstScore=history.length?history[history.length-1]:null;
        return {
          id:p.id,first_name:p.first_name,last_name:p.last_name,
          injuries:injuriesByProfile[p.id]||[],
          assessmentCount:countMap[p.id]||0,
          latestScore,firstScore,
          lastDate:lastDateMap[p.id]||null,
          history:history.slice().reverse(),
        };
      });
      setAthletes(transformed);
    } catch(e){
      console.error("Failed to load athletes:",e.message||e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{load();},[]);

  return {athletes,loading,reload:load};
}

function useAthleteAssessments(athleteId){
  const[assessments,setAssessments]=useState(null);
  const[exercises,setExercises]=useState(null);
  const[loading,setLoading]=useState(false);

  async function load(){
    if(!supabase||!athleteId){return;}
    setLoading(true);
    try {
      const {data:aRows,error}=await supabase
        .from("assessments")
        .select("id,created_at")
        .eq("profile_id",athleteId)
        .order("created_at",{ascending:false})
        .limit(10);
      if(error) throw error;
      if(!aRows?.length){setAssessments([]);setExercises({});setLoading(false);return;}

      const aIds=aRows.map(a=>a.id);

      const {data:results,error:rErr}=await supabase
        .from("assessment_results")
        .select("assessment_id,durability_score,shoulder_score,hips_score,knee_score,ankle_score,core_score,lower_back_score,chest_score,arms_score,range_of_motion_score,flexibility_score,mobility_score,functional_strength_score")
        .in("assessment_id",aIds);
      if(rErr) throw rErr;

      const resultsByAId={};
      (results||[]).forEach(r=>{resultsByAId[r.assessment_id]=r;});

      const grouped=aRows.map(a=>{
        const r=resultsByAId[a.id]||{};
        const pf=v=>v!=null?parseFloat(v):null;
        return {
          id:a.id,created_at:a.created_at,
          durability_score:pf(r.durability_score),shoulder_score:pf(r.shoulder_score),
          hips_score:pf(r.hips_score),knee_score:pf(r.knee_score),
          ankle_score:pf(r.ankle_score),core_score:pf(r.core_score),
          lower_back_score:pf(r.lower_back_score),chest_score:pf(r.chest_score),
          arms_score:pf(r.arms_score),range_of_motion_score:pf(r.range_of_motion_score),
          flexibility_score:pf(r.flexibility_score),mobility_score:pf(r.mobility_score),
          functional_strength_score:pf(r.functional_strength_score),
        };
      });

      const {data:reps}=await supabase
        .from("assessment_exercise_reps")
        .select("assessment_id,exercise_name,rep_number,overall_score")
        .in("assessment_id",aIds)
        .order("exercise_name").order("rep_number");

      const {data:exData}=await supabase
        .from("assessment_exercise_data")
        .select("assessment_id,exercise_name,angles,nuances")
        .in("assessment_id",aIds);

      const exDataMap={};
      (exData||[]).forEach(r=>{
        exDataMap[`${r.assessment_id}|${r.exercise_name}`]={
          angles:(r.angles||[]).map(a=>({id:a.angleId,mean:a.mean,max:a.max,min:a.min})),
          nuances:r.nuances||[],
        };
      });

      const exByAssessment={};
      (reps||[]).forEach(r=>{
        if(!exByAssessment[r.assessment_id]) exByAssessment[r.assessment_id]={};
        if(!exByAssessment[r.assessment_id][r.exercise_name]) exByAssessment[r.assessment_id][r.exercise_name]=[];
        exByAssessment[r.assessment_id][r.exercise_name].push(r.overall_score);
      });
      const exerciseMap={};
      Object.entries(exByAssessment).forEach(([aId,exObj])=>{
        exerciseMap[aId]=Object.entries(exObj).map(([name,repScores])=>{
          const extra=exDataMap[`${aId}|${name}`]||{};
          return {name,reps:repScores,nuances:extra.nuances||[],angles:extra.angles||[]};
        });
      });

      setAssessments(grouped);
      setExercises(exerciseMap);
    } catch(e){
      console.error("Failed to load assessments for",athleteId,":",e.message||e);
      setAssessments(null);
      setExercises(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{load();},[athleteId]);

  return {assessments,exercises,loading,reload:load};
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
function Spark({data,color,w=56,h=20}){
  if(!data||data.length<2) return null;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(2+(i/(data.length-1))*(w-4)).toFixed(1)},${(h-2-((v-mn)/rng)*(h-4)).toFixed(1)}`);
  const[lx,ly]=pts[pts.length-1].split(",");
  return(<svg width={w} height={h} style={{display:"block"}}><polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round"/><circle cx={lx} cy={ly} r={2.5} fill={color}/></svg>);
}

function Ring({score,size=100,stroke=8}){
  const s=pct(score)||0,r=(size-stroke)/2,c=2*Math.PI*r,col=sc(s);
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.bg} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c-(s/100)*c} strokeLinecap="round"/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:size*.26,fontWeight:800,color:col,lineHeight:1}}>{s}</span>
        <span style={{fontSize:9,color:C.muted,marginTop:1}}>/ 100</span>
      </div>
    </div>
  );
}

// ─── ANGLE ROW ────────────────────────────────────────────────────────────────
function AngleRow({angle}){
  const label=ANGLE_LABELS[angle.id]||angle.id.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase());
  const mx=180,mp=Math.min((angle.mean/mx)*100,100);
  return(
    <div style={{display:"grid",gridTemplateColumns:"130px 1fr 52px 44px 44px",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
      <span style={{fontSize:12,color:C.sub}}>{label}</span>
      <div style={{height:4,background:C.bg,borderRadius:2,position:"relative"}}>
        <div style={{position:"absolute",top:0,height:"100%",left:`${Math.min((angle.min/mx)*100,100)}%`,width:`${Math.min(((angle.max-angle.min)/mx)*100,100)}%`,background:C.border,borderRadius:2}}/>
        <div style={{position:"absolute",top:-2,height:8,width:2,left:`${mp}%`,background:C.ink,borderRadius:1,transform:"translateX(-50%)"}}/>
      </div>
      <span style={{fontSize:12,fontWeight:700,color:C.ink,textAlign:"right"}}>{typeof angle.mean==="number"?angle.mean.toFixed(1):angle.mean}°</span>
      <span style={{fontSize:11,color:C.muted,textAlign:"right"}}>{angle.max}°</span>
      <span style={{fontSize:11,color:C.muted,textAlign:"right"}}>{angle.min}°</span>
    </div>
  );
}

// ─── MOVEMENT CARD ────────────────────────────────────────────────────────────
function MovCard({ex,idx}){
  const[open,setOpen]=useState(false);
  const ra=Math.round(avg(ex.reps)*100),col=sc(ra);
  return(
    <div style={{borderRadius:C.radiusSm,overflow:"hidden",border:`1px solid ${open?col+"50":C.border}`,background:C.surface,transition:"border-color .15s"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",cursor:"pointer"}}>
        <span style={{fontSize:11,fontWeight:700,color:C.muted,width:18,flexShrink:0}}>{idx+1}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:C.ink,marginBottom:5}}>{ex.name}</div>
          <div style={{height:4,background:C.bg,borderRadius:3}}><div style={{height:"100%",width:`${ra}%`,background:col,borderRadius:3}}/></div>
        </div>
        <div style={{display:"flex",gap:4,flexShrink:0}}>
          {ex.reps.map((r,i)=>{const s=Math.round(r*100),c=sc(s);return(<div key={i} style={{width:28,height:28,borderRadius:"50%",background:sf(s),display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:c,border:`1px solid ${c}25`}}>{s}</div>);})}
        </div>
        <div style={{width:44,height:44,borderRadius:"50%",background:sf(ra),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:16,fontWeight:800,color:col}}>{ra}</span>
        </div>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2.5} style={{transform:open?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"16px 18px",display:"grid",gridTemplateColumns:ex.angles?.length?"1fr 1fr":"1fr",gap:20}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Findings</div>
            {!ex.nuances?.length?<p style={{fontSize:12,color:C.muted,margin:0}}>No flags.</p>
              :ex.nuances.map((n,i)=><div key={i} style={{fontSize:12,color:C.sub,padding:"6px 10px",background:C.bg,borderRadius:7,marginBottom:5}}>{n}</div>)
            }
          </div>
          {ex.angles?.length>0&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"130px 1fr 52px 44px 44px",gap:8,paddingBottom:6,marginBottom:2,borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em"}}>Angle</span>
                <span/>
                <span style={{fontSize:10,fontWeight:700,color:C.muted,textAlign:"right"}}>Avg</span>
                <span style={{fontSize:10,fontWeight:700,color:C.muted,textAlign:"right"}}>Max</span>
                <span style={{fontSize:10,fontWeight:700,color:C.muted,textAlign:"right"}}>Min</span>
              </div>
              {ex.angles.map((a,i)=><AngleRow key={i} angle={a}/>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ASSESSMENT DETAIL ────────────────────────────────────────────────────────
function AssessmentDetail({assessment,exercises,onBack}){
  const regions=[
    ["Shoulders",assessment.shoulder_score],["Hips",assessment.hips_score],
    ["Knees",assessment.knee_score],["Ankles",assessment.ankle_score],
    ["Core",assessment.core_score],["Lower Back",assessment.lower_back_score],
    ["Chest",assessment.chest_score],["Arms",assessment.arms_score],
  ].filter(([,v])=>v!=null&&parseFloat(v)>0);
  const smets=[
    ["ROM",assessment.range_of_motion_score],["Flexibility",assessment.flexibility_score],
    ["Mobility",assessment.mobility_score],["Func. Strength",assessment.functional_strength_score],
  ].filter(([,v])=>v!=null);
  return(
    <div>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:C.sub,padding:"0 0 20px",fontWeight:500}}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6"/></svg>
        All Assessments
      </button>
      <div style={{background:C.surface,borderRadius:C.radius,padding:"24px 28px",marginBottom:20,border:`1px solid ${C.border}`,display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <Ring score={assessment.durability_score} size={96} stroke={8}/>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>Assessment</div>
          <div style={{fontSize:20,fontWeight:800,color:C.ink,marginBottom:1}}>{fmt(assessment.created_at)}</div>
          <div style={{fontSize:13,color:C.sub,marginBottom:18}}>{fmtT(assessment.created_at)}</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {smets.map(([label,v])=>{const sv=pct(v);return(
              <div key={label} style={{minWidth:80}}>
                <span style={{fontSize:10,color:C.muted,fontWeight:600}}>{label}</span>
                <div style={{height:4,background:C.bg,borderRadius:2,margin:"4px 0"}}><div style={{height:"100%",width:`${sv}%`,background:sc(sv),borderRadius:2}}/></div>
                <span style={{fontSize:12,fontWeight:700,color:sc(sv)}}>{sv}</span>
              </div>
            );})}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,flexShrink:0}}>
          {regions.map(([label,v])=>{const sv=pct(v);return(
            <div key={label} style={{background:C.bg,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:2,fontWeight:500}}>{label}</div>
              <div style={{fontSize:18,fontWeight:800,color:sc(sv)}}>{sv}</div>
            </div>
          );})}
        </div>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>
        Movements · {exercises.length} recorded
      </div>
      {exercises.length===0
        ?<div style={{background:C.surface,borderRadius:C.radiusSm,padding:32,textAlign:"center",color:C.muted,fontSize:13,border:`1px solid ${C.border}`}}>No movement data.</div>
        :<div style={{display:"flex",flexDirection:"column",gap:8}}>{exercises.map((ex,i)=><MovCard key={ex.name} ex={ex} idx={i}/>)}</div>
      }
    </div>
  );
}

// ─── ASSESSMENTS TAB ─────────────────────────────────────────────────────────
function AssessmentsTab({athlete,assessments:propAssessments,exercises:propExercises}){
  const[selected,setSelected]=useState(null);
  const assessments=propAssessments||FALLBACK_DB.assessments[athlete.id]||[];
  const exercises=propExercises||FALLBACK_DB.exercises;

  if(selected){
    const detail=assessments.find(a=>a.id===selected);
    return <AssessmentDetail assessment={detail} exercises={(exercises||{})[selected]||[]} onBack={()=>setSelected(null)}/>;
  }

  if(!assessments.length) return(
    <div style={{background:C.surface,borderRadius:C.radius,padding:40,textAlign:"center",border:`1px solid ${C.border}`}}>
      <div style={{fontSize:14,color:C.muted}}>No detailed assessment data available for this athlete yet.</div>
    </div>
  );

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <p style={{margin:0,fontSize:13,color:C.sub}}>{athlete.assessmentCount} total assessments · showing {assessments.length} most recent</p>
        <div style={{display:"flex",alignItems:"center",gap:7,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 11px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#65a30d"}}/>
          <span style={{fontSize:11,color:C.sub,fontWeight:600}}>Real data</span>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column"}}>
        {assessments.map((a,i)=>{
          const s=pct(a.durability_score),col=sc(s);
          const prev=assessments[i+1];
          const diff=prev?s-pct(prev.durability_score):null;
          const hasEx=!!(exercises||{})[a.id];
          const regions=[["Shoulder",a.shoulder_score],["Hips",a.hips_score],["Core",a.core_score],["Lower Back",a.lower_back_score]].filter(([,v])=>v!=null&&parseFloat(v)>0);
          const lowest=[...regions].sort((a,b)=>parseFloat(a[1])-parseFloat(b[1]))[0];
          return(
            <div key={a.id} style={{display:"flex"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:32,flexShrink:0}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:col,marginTop:18,border:`2px solid ${C.surface}`,outline:`2px solid ${col}`,zIndex:1,flexShrink:0}}/>
                {i<assessments.length-1&&<div style={{width:1,flex:1,background:C.border,marginTop:4}}/>}
              </div>
              <div
                onClick={()=>hasEx&&setSelected(a.id)}
                style={{flex:1,background:C.surface,borderRadius:C.radiusSm,border:`1px solid ${C.border}`,padding:"14px 18px",marginBottom:8,marginLeft:12,cursor:hasEx?"pointer":"default",transition:"border-color .15s, transform .1s"}}
                onMouseEnter={e=>{if(hasEx){e.currentTarget.style.borderColor=col+"60";e.currentTarget.style.transform="translateX(2px)";}}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}
              >
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:50,height:50,borderRadius:"50%",background:sf(s),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:18,fontWeight:800,color:col}}>{s}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:14,fontWeight:700,color:C.ink}}>{fmt(a.created_at)}</span>
                      <span style={{fontSize:12,color:C.muted}}>{fmtT(a.created_at)}</span>
                      {diff!==null&&<span style={{fontSize:12,fontWeight:700,color:diff>0?"#16a34a":diff<0?"#dc2626":C.muted}}>{diff>0?"+":""}{diff}</span>}
                    </div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                      {regions.map(([label,v])=>{const sv=pct(v);return(
                        <div key={label} style={{display:"flex",alignItems:"center",gap:4}}>
                          <span style={{fontSize:10,color:C.muted,minWidth:48}}>{label}</span>
                          <div style={{width:36,height:3,background:C.bg,borderRadius:2}}><div style={{height:"100%",width:`${sv}%`,background:sc(sv),borderRadius:2}}/></div>
                          <span style={{fontSize:10,fontWeight:700,color:sc(sv)}}>{sv}</span>
                        </div>
                      );})}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    {lowest&&<span style={{fontSize:11,fontWeight:600,color:sc(pct(lowest[1]))}}>{lowest[0]} {pct(lowest[1])}</span>}
                    {!hasEx&&<span style={{fontSize:11,color:C.muted}}>No movement data</span>}
                    {hasEx&&<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({athlete,assessments:propAssessments}){
  const assessments=propAssessments||FALLBACK_DB.assessments[athlete.id]||[];
  if(!assessments.length) return <div style={{textAlign:"center",color:C.muted,padding:48,fontSize:14}}>No assessments yet.</div>;
  const latest=assessments[0];
  const s=pct(latest.durability_score);
  const diff=assessments.length>1?s-pct(assessments[assessments.length-1].durability_score):0;
  const history=assessments.slice().reverse().map(a=>parseFloat(a.durability_score));
  const smets=[["ROM",latest.range_of_motion_score],["Flexibility",latest.flexibility_score],["Mobility",latest.mobility_score],["Func. Strength",latest.functional_strength_score]].filter(([,v])=>v!=null);
  const regions=[["Core",latest.core_score],["Hips",latest.hips_score],["Shoulders",latest.shoulder_score],["Knees",latest.knee_score],["Ankles",latest.ankle_score],["Lower Back",latest.lower_back_score],["Chest",latest.chest_score],["Arms",latest.arms_score]].filter(([,v])=>v!=null&&parseFloat(v)>0).sort((a,b)=>parseFloat(a[1])-parseFloat(b[1]));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{background:C.surface,borderRadius:C.radius,padding:"24px 28px",border:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"auto 1fr auto",gap:24,alignItems:"center"}}>
        <Ring score={latest.durability_score} size={108} stroke={9}/>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Current Durability Score</div>
          <div style={{display:"flex",gap:10,alignItems:"baseline",marginBottom:14}}>
            <span style={{fontSize:28,fontWeight:800,color:sc(s)}}>{s}</span>
            <span style={{fontSize:13,fontWeight:600,color:diff>0?"#16a34a":diff<0?"#dc2626":C.muted}}>{diff>0?"+":""}{diff} from first</span>
          </div>
          <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
            {smets.map(([label,v])=>{const sv=pct(v);return(
              <div key={label} style={{minWidth:72}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:3,fontWeight:600}}>{label}</div>
                <div style={{height:4,background:C.bg,borderRadius:2,marginBottom:3}}><div style={{height:"100%",width:`${sv}%`,background:sc(sv),borderRadius:2}}/></div>
                <span style={{fontSize:12,fontWeight:700,color:sc(sv)}}>{sv}</span>
              </div>
            );})}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Trend</div>
          <Spark data={history} color={sc(s)} w={90} h={40}/>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>{athlete.assessmentCount} assessments</div>
        </div>
      </div>
      <div style={{background:C.surface,borderRadius:C.radius,padding:"22px 28px",border:`1px solid ${C.border}`}}>
        <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:16}}>Body Regions</div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {regions.map(([label,v])=>{const sv=pct(v),col=sc(sv);return(
            <div key={label} style={{display:"grid",gridTemplateColumns:"90px 1fr 36px",alignItems:"center",gap:14}}>
              <span style={{fontSize:13,color:C.sub}}>{label}</span>
              <div style={{height:7,background:C.bg,borderRadius:4}}><div style={{height:"100%",width:`${sv}%`,background:col,borderRadius:4}}/></div>
              <span style={{fontSize:13,fontWeight:800,color:col,textAlign:"right"}}>{sv}</span>
            </div>
          );})}
        </div>
      </div>
      {regions.slice(0,3).length>0&&(
        <div style={{background:C.surface,borderRadius:C.radius,padding:"22px 28px",border:`1px solid ${C.border}`,borderLeft:"4px solid #ea580c"}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Coach Focus — Latest Assessment</div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(regions.slice(0,3).length,3)},1fr)`,gap:12}}>
            {regions.slice(0,3).map(([label,v])=>{const sv=pct(v);return(
              <div key={label} style={{background:C.bg,borderRadius:C.radiusSm,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <span style={{fontWeight:700,fontSize:14,color:C.ink}}>{label}</span>
                  <span style={{background:sf(sv),color:sc(sv),borderRadius:999,padding:"3px 9px",fontWeight:800,fontSize:14}}>{sv}</span>
                </div>
                <div style={{fontSize:12,color:C.sub,lineHeight:1.5}}>{sv<55?"Priority — limiting overall durability":sv<70?"Moderate — monitor closely":"Needs attention"}</div>
              </div>
            );})}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ATHLETE DETAIL ───────────────────────────────────────────────────────────
function AthleteDetail({athlete,onBack}){
  const[tab,setTab]=useState("overview");
  const{assessments:liveAssessments,exercises:liveExercises,loading:loadingAssessments,reload}=useAthleteAssessments(athlete?.id);
  const st=ST[status(athlete.latestScore,athlete.firstScore)]||ST.stable;
  return(
    <div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:C.sub,padding:"0 0 20px",fontWeight:500}}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6"/></svg>
        All Athletes
      </button>
      <div style={{background:C.surface,borderRadius:C.radius,padding:"22px 28px",marginBottom:24,border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:18}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.limeXl,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:20,flexShrink:0,color:C.ink}}>
            {(athlete.first_name?.[0]||"")+(athlete.last_name?.[0]||"")}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4,flexWrap:"wrap"}}>
              <h1 style={{fontSize:22,fontWeight:800,color:C.ink,margin:0}}>{athlete.first_name} {athlete.last_name}</h1>
              <span style={{background:st.bg,color:st.color,borderRadius:999,padding:"4px 11px",fontSize:12,fontWeight:700}}>{st.label}</span>
            </div>
            <div style={{display:"flex",gap:18,fontSize:13,color:C.sub,flexWrap:"wrap"}}>
              {athlete.lastSeen===0?"Last assessed today":athlete.lastSeen===1?"Last assessed yesterday":athlete.lastSeen!=null?`Last assessed ${athlete.lastSeen}d ago`:"Never assessed"}
              <span>·</span><span>{athlete.assessmentCount} total assessments</span>
            </div>
          </div>
          <button onClick={reload} disabled={loadingAssessments} style={{fontSize:11,fontWeight:700,fontFamily:"inherit",background:C.limeXl,color:C.ink,border:`1px solid ${C.lime}`,borderRadius:7,padding:"6px 12px",cursor:loadingAssessments?"wait":"pointer",opacity:loadingAssessments?0.6:1,display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{animation:loadingAssessments?"spin 1s linear infinite":"none"}}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            {loadingAssessments?"Loading...":"Refresh"}
          </button>
          {athlete.latestScore&&<Ring score={athlete.latestScore} size={84} stroke={7}/>}
        </div>
      </div>
      <div style={{display:"flex",gap:2,marginBottom:22,background:C.surface,borderRadius:C.radiusSm,padding:4,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {[["overview","Overview"],["assessments","Assessments"],["progress","Progress"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"8px 20px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:600,background:tab===id?C.lime:"transparent",color:tab===id?C.ink:C.sub,transition:"all .15s"}}>
            {label}
          </button>
        ))}
      </div>
      {loadingAssessments&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:120,color:C.muted,fontSize:13}}>Loading assessment data...</div>}
      {!loadingAssessments&&tab==="overview"&&<OverviewTab athlete={athlete} assessments={liveAssessments}/>}
      {!loadingAssessments&&tab==="assessments"&&<AssessmentsTab athlete={athlete} assessments={liveAssessments} exercises={liveExercises}/>}
      {!loadingAssessments&&tab==="progress"&&<ProgressTab athlete={athlete}/>}
    </div>
  );
}

// ─── ATHLETE LIST ─────────────────────────────────────────────────────────────
function AthleteList({onSelect,athletes:propAthletes,loading}){
  const[search,setSearch]=useState("");
  if(loading) return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:300,color:C.muted,fontSize:14}}>Loading athletes...</div>
  );
  const athletes=(propAthletes||FALLBACK_DB.athletes).map(a=>({...a,lastSeen:dAgo(a.lastDate),status:status(a.latestScore,a.firstScore)}));
  const filtered=athletes.filter(a=>`${a.first_name} ${a.last_name}`.toLowerCase().includes(search.toLowerCase()));
  const withS=athletes.filter(a=>a.latestScore!=null);
  const teamAvg=withS.length?Math.round(avg(withS.map(a=>a.latestScore))*100):0;
  const atRisk=athletes.filter(a=>a.latestScore&&a.latestScore<0.55).length;
  const overdue=athletes.filter(a=>a.lastSeen!=null&&a.lastSeen>7).length;
  return(
    <div>
      <div style={{marginBottom:26}}>
        <h1 style={{fontSize:28,fontWeight:800,color:C.ink,margin:"0 0 4px"}}>Athletes</h1>
        <p style={{margin:0,fontSize:14,color:C.sub}}>Movement quality and assessment history</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
        {[
          {label:"Total Athletes",value:athletes.length,sub:"across all teams",vc:C.ink},
          {label:"Team Average",value:teamAvg,sub:"durability score",vc:sc(teamAvg)},
          {label:"At Risk",value:atRisk,sub:"score below 55",vc:atRisk>0?"#ea580c":"#16a34a"},
          {label:"Needs Check-in",value:overdue,sub:"7+ days inactive",vc:overdue>0?"#dc2626":"#16a34a"},
        ].map(s=>(
          <div key={s.label} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,padding:"18px 20px"}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".04em",marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:30,fontWeight:800,color:s.vc,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:5}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search athletes…"
        style={{width:"100%",padding:"11px 16px",border:`1px solid ${C.border}`,borderRadius:C.radiusSm,fontSize:14,fontFamily:"inherit",background:C.surface,outline:"none",color:C.ink,marginBottom:14,boxSizing:"border-box"}}/>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:C.radius,overflow:"hidden"}}>
        {filtered.length===0&&<div style={{padding:32,textAlign:"center",color:C.muted,fontSize:13}}>No athletes found.</div>}
        {filtered.map((a,i)=>{
          const st=ST[a.status]||ST.stable;
          const s=a.latestScore?Math.round(a.latestScore*100):null;
          const diff=a.latestScore&&a.firstScore?Math.round((a.latestScore-a.firstScore)*100):null;
          const col=s?sc(s):C.muted;
          return(
            <div key={a.id} onClick={()=>onSelect(a)}
              style={{display:"flex",alignItems:"center",gap:14,padding:"15px 20px",cursor:"pointer",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{width:42,height:42,borderRadius:"50%",background:C.limeXl,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,flexShrink:0,color:C.ink}}>
                {(a.first_name?.[0]||"")+(a.last_name?.[0]||"")}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{a.first_name} {a.last_name}</div>
                <div style={{fontSize:12,color:C.muted}}>{a.assessmentCount} assessments</div>
              </div>
              <span style={{background:st.bg,color:st.color,borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{st.label}</span>
              <div style={{display:"flex",alignItems:"center",gap:8,minWidth:80}}>
                <span style={{fontSize:22,fontWeight:800,color:col}}>{s??"—"}</span>
                {diff!==null&&<span style={{fontSize:12,fontWeight:600,color:diff>=0?"#16a34a":"#dc2626"}}>{diff>=0?"+":""}{diff}</span>}
              </div>
              {a.history.length>=2&&<Spark data={a.history} color={col} w={56} h={20}/>}
              <span style={{fontSize:12,color:a.lastSeen>7?"#dc2626":C.muted,fontWeight:a.lastSeen>7?700:400,minWidth:68,textAlign:"right"}}>
                {a.lastSeen===0?"Today":a.lastSeen===1?"Yesterday":a.lastSeen!=null?`${a.lastSeen}d ago`:"Never"}
              </span>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── PROGRAMS DATA ────────────────────────────────────────────────────────────
const TEAMS_DATA = [
  {
    id:"aaaa0001",name:"Performance Group",color:"#c8e64e",textColor:"#18181b",
    description:"High-frequency athletes · 4–5x/week",
    members:[
      {id:"49ca8f8e-00dc-4582-a92e-58212121f777",name:"Gabby Rizika",score:62,status:"improving",injuries:["ACL/MCL tear","Meniscus","Shin splints","Lower back"],program:"Personalized 12-week",programStatus:"ready"},
      {id:"0812572d-48a9-40c9-bff8-bd5afc289d7d",name:"Hannah Steadman",score:72,status:"stable",injuries:["Lower back pain"],program:"Personalized 12-week",programStatus:"ready"},
      {id:"c2c97de8-affe-42c1-8c1a-fba9f5b99c3c",name:"Drew Adams",score:64,status:"stable",injuries:["Hamstring strain","Lower back pain"],program:null,programStatus:null},
    ]
  },
  {
    id:"aaaa0002",name:"Rehab Track",color:"#fb923c",textColor:"#ffffff",
    description:"Active injury / post-surgery athletes",
    members:[
      {id:"818c56b1-a2fe-4e01-aab6-1e33e08ebc22",name:"Steph Xu",score:54,status:"declining",injuries:["ACL/MCL tear"],program:"Personalized 12-week",programStatus:"ready"},
      {id:"13370a40-2061-425a-aed9-698cd85b90da",name:"Maria Guerrero R",score:null,status:"pending",injuries:["ACL/MCL/LCL tear"],program:null,programStatus:null},
      {id:"4c1f3ab0-d73c-49e9-be1a-31a0b2677ea4",name:"Amaury De Bock",score:70,status:"declining",injuries:["Hamstring strain","IT band","Achilles tendonitis","Chronic pain"],program:null,programStatus:null},
      {id:"932ff2dd-f803-4322-8688-f395ce4afe7a",name:"Jack O'Brien",score:41,status:"at-risk",injuries:[],program:null,programStatus:null},
    ]
  },
  {
    id:"aaaa0003",name:"Foundations",color:"#818cf8",textColor:"#ffffff",
    description:"Onboarding / new athletes",
    members:[
      {id:"61a94c84-4fd4-45ed-9f25-3f717e36abfb",name:"Annabelle Hutchinson",score:72,status:"stable",injuries:["Shoulder impingement"],program:null,programStatus:null},
      {id:"50887f9a-988f-44fe-9274-29b0d805a5ad",name:"Blake Blaze",score:null,status:"pending",injuries:[],program:null,programStatus:null},
      {id:"946748b5-944f-44f6-b9b3-bf5bdb736e24",name:"Aaron Win",score:null,status:"pending",injuries:[],program:null,programStatus:null},
    ]
  },
];

const BLOCK_LIBRARY = [
  {id:53,name:"Warm-up Set A",type:"Warm-up",duration:5,color:"#dcfce7",typeColor:"#16a34a",movements:["Cat-Cow","Arm Circles","Bodyweight Lateral Squat","Calf Raises"]},
  {id:54,name:"Warm-up Set B",type:"Warm-up",duration:5,color:"#dcfce7",typeColor:"#16a34a",movements:["Hip Flexor Stretch","Glute Bridge","Inchworm","Jumping Jacks"]},
  {id:55,name:"Warm-up Set C",type:"Warm-up",duration:5,color:"#dcfce7",typeColor:"#16a34a",movements:["World's Greatest Stretch","Leg Swings","Ankle Circles","Thoracic Rotation"]},
  {id:56,name:"Strength Set A",type:"Strength",duration:20,color:"#dbeafe",typeColor:"#2563eb",movements:["Squat 3×10","Bodyweight Hip Hinge 3×8","Push-Up 3×8","Bodyweight Row 3×8","Bridge w/ Squeeze 3×12","Side Plank 3×30s"]},
  {id:57,name:"Strength Set B",type:"Strength",duration:20,color:"#dbeafe",typeColor:"#2563eb",movements:["Split Squat 3×8","Single-Leg Deadlift 3×8","Push-Up w/ Pause 3×6","TRX Row 3×10","Pallof Press 3×10"]},
  {id:58,name:"Strength Set C",type:"Strength",duration:20,color:"#dbeafe",typeColor:"#2563eb",movements:["Bulgarian Split Squat 3×8","Nordic Curl 3×5","Dumbbell Press 3×10","Seated Row 3×10","Dead Bug 3×8"]},
  {id:60,name:"Conditioning A",type:"Conditioning",duration:15,color:"#fef9c3",typeColor:"#ca8a04",movements:["High Knees 30s","Mountain Climbers 30s","Squat Jumps 30s","Rest 30s","×4 rounds"]},
  {id:61,name:"Conditioning B",type:"Conditioning",duration:15,color:"#fef9c3",typeColor:"#ca8a04",movements:["Burpees 30s","Lateral Shuffles 30s","Plank to Push-Up 30s","Rest 30s","×4 rounds"]},
  {id:4,name:"Cool-down A",type:"Cool-down",duration:8,color:"#f3e8ff",typeColor:"#7c3aed",movements:["Hip Flexor Stretch 60s","Hamstring Stretch 60s","Thoracic Rotation 30s","Child's Pose 60s"]},
  {id:62,name:"Cool-down B",type:"Cool-down",duration:8,color:"#f3e8ff",typeColor:"#7c3aed",movements:["Pigeon Pose 90s","IT Band Stretch 60s","Chest Opener 30s","90/90 Hip Stretch 60s"]},
  {id:21,name:"Durability Block V1",type:"Durability",duration:10,color:"#fce7f3",typeColor:"#db2777",movements:["Cat-Cow","Calf Raises","Hip Flexor Stretch","Squat","Push-Up","Bodyweight Row","High Knees","Mountain Climbers"]},
  {id:22,name:"Durability Block V2",type:"Durability",duration:10,color:"#fce7f3",typeColor:"#db2777",movements:["All Fours Iso","Tall Plank","Hip Hinge","Bridge","Pallof Press","Dead Bug","Side Plank","Inchworm"]},
  {id:70,name:"ACL Prehab Block",type:"Durability",duration:12,color:"#fce7f3",typeColor:"#db2777",movements:["Nordic Curl 3×5","Single-Leg Squat 3×8","Terminal Knee Ext 3×15","Lateral Band Walk 3×12","Clamshell 3×15","Glute Bridge 3×12"]},
  {id:71,name:"Lower Back Stability",type:"Durability",duration:10,color:"#fce7f3",typeColor:"#db2777",movements:["Dead Bug 3×8","Bird Dog 3×10","Cat-Cow 1×20","McGill Big 3","Pallof Press 3×10"]},
  {id:72,name:"Shoulder Health Block",type:"Durability",duration:8,color:"#fce7f3",typeColor:"#db2777",movements:["Band Pull-Apart 3×15","Face Pull 3×15","Prone Y-T-W 2×10","Sleeper Stretch 60s","Cross-body Stretch 30s"]},
];

const TEAM_INSIGHTS = [
  {id:1,severity:"high",title:"Lower Body Injury Cluster",detail:"6/10 athletes have active lower body injuries. 3 have ACL/MCL tears — this is your highest-risk area as a team.",suggestion:"ACL Prehab Block",suggestionId:70,affectedAthletes:["Gabby Rizika","Steph Xu","Maria Guerrero R","Amaury De Bock","Drew Adams","Jack O'Brien"]},
  {id:2,severity:"medium",title:"Declining Shoulder ROM",detail:"Gabby (Shoulder 60), Annabelle (impingement) — shoulder abduction is a consistent weak point across assessments.",suggestion:"Shoulder Health Block",suggestionId:72,affectedAthletes:["Gabby Rizika","Annabelle Hutchinson"]},
  {id:3,severity:"medium",title:"Lower Back — 3 Athletes",detail:"Hannah, Drew, and Gabby all report active lower back pain. Consider adding spinal stability to warm-up blocks.",suggestion:"Lower Back Stability",suggestionId:71,affectedAthletes:["Gabby Rizika","Hannah Steadman","Drew Adams"]},
];

const MOVEMENT_LIBRARY = [
  {id:47,name:"Tall Plank",body:["core","shoulders"],equipment:"none",super:["stability"]},
  {id:48,name:"All Fours Iso",body:["core","hips"],equipment:"none",super:["stability"]},
  {id:43,name:"Seated Meditation",body:["mental"],equipment:"mat",super:["mindfulness"]},
  {id:103,name:"Overhead Squat",body:["hips","ankles","shoulders"],equipment:"none",super:["mobility","ROM"]},
  {id:105,name:"Forward Lunge",body:["hips","knees"],equipment:"none",super:["stability","functional_strength"]},
  {id:109,name:"Standing Back Extension",body:["lower_back","core","glutes"],equipment:"none",super:["mobility"]},
  {name:"Squat",body:["hips","knees","ankles"],equipment:"none",super:["functional_strength"]},
  {name:"Push-Up",body:["chest","shoulders","core"],equipment:"none",super:["functional_strength"]},
  {name:"Hip Flexor Stretch",body:["hips","lower_back"],equipment:"none",super:["flexibility","ROM"]},
  {name:"Cat-Cow",body:["lower_back","core"],equipment:"none",super:["mobility","ROM"]},
  {name:"Nordic Curl",body:["knees","hips"],equipment:"none",super:["functional_strength"]},
  {name:"Dead Bug",body:["core"],equipment:"none",super:["stability"]},
  {name:"Bird Dog",body:["core","lower_back"],equipment:"none",super:["stability"]},
  {name:"Clamshell",body:["hips"],equipment:"band",super:["functional_strength"]},
  {name:"Glute Bridge",body:["hips","glutes"],equipment:"none",super:["functional_strength"]},
  {name:"Side Plank",body:["core"],equipment:"none",super:["stability"]},
  {name:"Calf Raises",body:["ankles"],equipment:"none",super:["functional_strength"]},
  {name:"Inchworm",body:["lower_back","hips"],equipment:"none",super:["mobility"]},
  {name:"Arm Circles",body:["shoulders"],equipment:"none",super:["mobility","ROM"]},
  {name:"Band Pull-Apart",body:["shoulders"],equipment:"band",super:["functional_strength"]},
];

// ─── PROGRAMS TAB ─────────────────────────────────────────────────────────────
function ProgramsTab({savedWorkouts,setSavedWorkouts}) {
  const [subView, setSubView] = useState("teams");
  const tabs = [
    {id:"teams",label:"Teams & Roster"},
    {id:"builder",label:"Workout Builder"},
    {id:"library",label:"Movement Library"},
    {id:"workout-library",label:"Workout Library"},
    {id:"uploads",label:"Uploads"},
  ];
  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:800,color:C.ink,margin:"0 0 4px"}}>Programs</h1>
        <p style={{margin:0,fontSize:14,color:C.sub}}>Build, assign, and manage training programs for your athletes</p>
      </div>
      <div style={{display:"flex",gap:2,marginBottom:24,background:C.surface,borderRadius:C.radiusSm,padding:4,border:`1px solid ${C.border}`,width:"fit-content"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setSubView(t.id)} style={{padding:"8px 18px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,background:subView===t.id?C.lime:"transparent",color:subView===t.id?C.ink:C.sub,transition:"all .15s",whiteSpace:"nowrap"}}>
            {t.label}
          </button>
        ))}
      </div>
      {subView==="teams"   && <TeamsView savedWorkouts={savedWorkouts} setSavedWorkouts={setSavedWorkouts}/>}
      {subView==="builder" && <BuilderView savedWorkouts={savedWorkouts} setSavedWorkouts={setSavedWorkouts}/>}
      {subView==="library" && <LibraryView/>}
      {subView==="workout-library" && <WorkoutLibraryView savedWorkouts={savedWorkouts} setSavedWorkouts={setSavedWorkouts}/>}
      {subView==="uploads" && <UploadsView/>}
    </div>
  );
}

// ─── TEAMS VIEW ───────────────────────────────────────────────────────────────
function TeamsView({savedWorkouts,setSavedWorkouts}) {
  const [expanded,setExpanded] = useState("aaaa0001");
  const [appliedInsights,setAppliedInsights] = useState([]);
  const [toast,setToast] = useState(null);
  const [buildTarget, setBuildTarget] = useState(null);
  const [sendTarget, setSendTarget] = useState(null);

  const showToast = msg => {
    setToast(msg);
    setTimeout(()=>setToast(null),3000);
  };

  const applyInsight = (insight) => {
    setAppliedInsights(p=>[...p,insight.id]);
    showToast(`"${insight.suggestion}" added to all affected athletes' next session`);
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,alignItems:"start"}}>
      {/* Teams list */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {TEAMS_DATA.map(team=>{
          const isOpen=expanded===team.id;
          const withInjuries=team.members.filter(m=>m.injuries.length>0).length;
          const withPrograms=team.members.filter(m=>m.program).length;
          return(
            <div key={team.id} style={{background:C.surface,borderRadius:C.radius,border:`1px solid ${C.border}`,overflow:"hidden"}}>
              <div onClick={()=>setExpanded(isOpen?null:team.id)} style={{display:"flex",alignItems:"center",gap:16,padding:"18px 22px",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:10,height:10,borderRadius:"50%",background:team.color,flexShrink:0,boxShadow:`0 0 0 3px ${team.color}40`}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:800,color:C.ink}}>{team.name}</div>
                  <div style={{fontSize:12,color:C.muted}}>{team.description}</div>
                </div>
                <div style={{display:"flex",gap:16,fontSize:12}}>
                  <span style={{color:C.sub}}><b style={{color:C.ink}}>{team.members.length}</b> athletes</span>
                  <span style={{color:withPrograms>0?"#16a34a":C.muted}}><b>{withPrograms}</b> with programs</span>
                  {withInjuries>0&&<span style={{display:"flex",alignItems:"center",gap:3,color:"#ea580c",fontWeight:700}}><svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth={2.5}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>{withInjuries} injuries</span>}
                </div>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2.5} style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              {isOpen&&(
                <div style={{borderTop:`1px solid ${C.border}`}}>
                  {/* Team header bar */}
                  <div style={{background:team.color+"18",borderBottom:`1px solid ${C.border}`,padding:"10px 22px",display:"grid",gridTemplateColumns:"1fr 140px 130px 100px 120px",gap:12,fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".05em"}}>
                    <span>Athlete</span><span>Score</span><span>Injuries</span><span>Program</span><span>Actions</span>
                  </div>
                  {team.members.map((m,i)=>{
                    const s=m.score,col=s?sc(s):C.muted;
                    const st=ST[m.status]||ST.stable;
                    return(
                      <div key={m.id} style={{display:"grid",gridTemplateColumns:"1fr 140px 130px 100px 120px",gap:12,padding:"13px 22px",alignItems:"center",borderBottom:i<team.members.length-1?`1px solid ${C.border}`:"none",transition:"background .1s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:C.limeXl,display:"grid",placeItems:"center",fontWeight:800,fontSize:11,color:C.ink,flexShrink:0}}>
                            {m.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                          </div>
                          <div>
                            <div style={{fontSize:13,fontWeight:700,color:C.ink}}>{m.name}</div>
                            <span style={{background:st.bg,color:st.color,borderRadius:999,padding:"1px 7px",fontSize:10,fontWeight:700}}>{st.label}</span>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:22,fontWeight:800,color:col}}>{s??<span style={{fontSize:13,color:C.muted}}>—</span>}</span>
                          {s&&<div style={{width:36,height:4,background:C.bg,borderRadius:2}}><div style={{height:"100%",width:`${s}%`,background:col,borderRadius:2}}/></div>}
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                          {m.injuries.slice(0,2).map((inj,j)=>(
                            <span key={j} style={{fontSize:9,background:"#fef2f2",color:"#dc2626",borderRadius:4,padding:"2px 5px",fontWeight:600,lineHeight:1.3}}>{inj.length>14?inj.slice(0,14)+"…":inj}</span>
                          ))}
                          {m.injuries.length>2&&<span style={{fontSize:9,color:C.muted}}>+{m.injuries.length-2}</span>}
                          {!m.injuries.length&&<span style={{fontSize:11,color:C.muted}}>None</span>}
                        </div>
                        <div>
                          {m.program
                            ?<span style={{fontSize:11,background:"#f0fdf4",color:"#16a34a",borderRadius:5,padding:"3px 7px",fontWeight:700}}>Assigned</span>
                            :<span style={{fontSize:11,background:C.bg,color:C.muted,borderRadius:5,padding:"3px 7px"}}>None</span>
                          }
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>setBuildTarget(m)} style={{fontSize:11,background:C.lime,color:C.ink,border:"none",borderRadius:6,padding:"5px 10px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Build</button>
                          <button onClick={()=>setSendTarget(m)} style={{fontSize:11,background:C.bg,color:C.sub,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 8px",cursor:"pointer",fontFamily:"inherit"}}>Send</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Team-wide insight panel */}
      <div style={{position:"sticky",top:0,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:C.surface,borderRadius:C.radius,border:`1px solid ${C.border}`,padding:"18px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:28,height:28,borderRadius:7,background:C.lime,display:"grid",placeItems:"center"}}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={2.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:C.ink}}>Team Intelligence</div>
              <div style={{fontSize:11,color:C.muted}}>Patterns across all 10 athletes</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {TEAM_INSIGHTS.map(ins=>{
              const applied=appliedInsights.includes(ins.id);
              const block=BLOCK_LIBRARY.find(b=>b.id===ins.suggestionId);
              return(
                <div key={ins.id} style={{background:applied?"#f0fdf4":C.bg,borderRadius:C.radiusSm,border:`1px solid ${applied?"#bbf7d0":C.border}`,padding:"12px 14px",transition:"all .3s"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
                    
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.ink,marginBottom:2}}>{ins.title}</div>
                      <div style={{fontSize:11,color:C.sub,lineHeight:1.4}}>{ins.detail}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>
                    {ins.affectedAthletes.map(a=>(
                      <span key={a} style={{fontSize:9,background:C.surface,border:`1px solid ${C.border}`,color:C.sub,borderRadius:4,padding:"1px 5px"}}>{a.split(" ")[0]}</span>
                    ))}
                  </div>
                  {applied
                    ?<div style={{fontSize:11,color:"#16a34a",fontWeight:700}}>Applied to all sessions</div>
                    :<div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,fontSize:11,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 8px"}}>
                        <span style={{color:C.muted}}>Suggest: </span><span style={{fontWeight:700,color:C.ink}}>{ins.suggestion}</span>
                      </div>
                      <button onClick={()=>applyInsight(ins)} style={{fontSize:11,background:C.lime,color:C.ink,border:"none",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,whiteSpace:"nowrap"}}>
                        Apply
                      </button>
                    </div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Build Modal */}
      {buildTarget&&<BuilderModal athlete={buildTarget} savedWorkouts={savedWorkouts} setSavedWorkouts={setSavedWorkouts} onClose={()=>setBuildTarget(null)} onSend={(w)=>{setSendTarget({...buildTarget,preloadedWorkout:w});setBuildTarget(null);}}/>}

      {/* Send Modal */}
      {sendTarget&&<SendModal athlete={sendTarget} savedWorkouts={savedWorkouts} onClose={()=>setSendTarget(null)} onSent={()=>{showToast(`Program sent to ${sendTarget.name.split(" ")[0]}`);setSendTarget(null);}}/>}

      {/* Toast */}
      {toast&&(
        <div style={{position:"fixed",bottom:24,right:24,background:C.ink,color:"#fff",borderRadius:C.radiusSm,padding:"12px 18px",fontSize:13,fontWeight:600,boxShadow:"0 4px 24px rgba(0,0,0,.18)",zIndex:999,animation:"fadeIn .2s ease",maxWidth:320}}>
          {toast}
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </div>
  );
}

// ─── BUILDER VIEW ─────────────────────────────────────────────────────────────
function BuilderView({savedWorkouts=[],setSavedWorkouts,presetAthlete=null}) {
  const [workoutName, setWorkoutName] = useState("Untitled Workout");
  const [targetType, setTargetType] = useState("individual"); // individual | team
  const [targetId, setTargetId] = useState("49ca8f8e-00dc-4582-a92e-58212121f777");
  const [workoutBlocks, setWorkoutBlocks] = useState([]);
  const [blockFilter, setBlockFilter] = useState("All");
  const [blockSearch, setBlockSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [showSend, setShowSend] = useState(false);
  const [sent, setSent] = useState(false);
  const [notes, setNotes] = useState("");
  const [saveMsg, setSaveMsg] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const blockTypes = ["All","Warm-up","Strength","Conditioning","Cool-down","Durability"];
  const filteredLib = BLOCK_LIBRARY.filter(b =>
    (blockFilter==="All"||b.type===blockFilter) &&
    b.name.toLowerCase().includes(blockSearch.toLowerCase())
  );
  const totalDuration = workoutBlocks.reduce((s,b)=>s+(b.duration||0),0);
  const allAthletes = TEAMS_DATA.flatMap(t=>t.members);
  const allTeams = TEAMS_DATA;

  const addBlock = (block) => {
    if(!workoutBlocks.find(b=>b.id===block.id))
      setWorkoutBlocks(p=>[...p,{...block,_uid:Date.now()}]);
  };
  const removeBlock = uid => setWorkoutBlocks(p=>p.filter(b=>b._uid!==uid));
  const moveBlock = (uid,dir) => {
    setWorkoutBlocks(p=>{
      const i=p.findIndex(b=>b._uid===uid);
      if(dir==="up"&&i===0) return p;
      if(dir==="down"&&i===p.length-1) return p;
      const n=[...p]; [n[i],n[dir==="up"?i-1:i+1]]=[n[dir==="up"?i-1:i+1],n[i]];
      return n;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const id=parseInt(e.dataTransfer.getData("blockId"));
    const block=BLOCK_LIBRARY.find(b=>b.id===id);
    if(block) addBlock(block);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(()=>{setSent(false);setShowSend(false);setWorkoutBlocks([]);setWorkoutName("Untitled Workout");},2200);
  };

  const target = targetType==="individual"
    ? allAthletes.find(a=>a.id===targetId)
    : allTeams.find(t=>t.id===targetId);

  return (
    <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16,height:"calc(100vh - 220px)",minHeight:500}}>
      {/* Block Library Panel */}
      <div style={{background:C.surface,borderRadius:C.radius,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Block Library</div>
          <input value={blockSearch} onChange={e=>setBlockSearch(e.target.value)} placeholder="Search blocks…"
            style={{width:"100%",padding:"8px 10px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"inherit",background:C.bg,outline:"none",color:C.ink,boxSizing:"border-box",marginBottom:8}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {blockTypes.map(t=>(
              <button key={t} onClick={()=>setBlockFilter(t)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:`1px solid ${blockFilter===t?C.limeDim:C.border}`,background:blockFilter===t?C.limeXl:C.bg,color:blockFilter===t?C.ink:C.sub,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{flex:1,overflow:"auto",padding:"8px"}}>
          {filteredLib.map(block=>(
            <div key={block.id}
              draggable
              onDragStart={e=>{e.dataTransfer.setData("blockId",block.id);setDraggingId(block.id);}}
              onDragEnd={()=>setDraggingId(null)}
              style={{padding:"10px 12px",borderRadius:9,border:`1px solid ${C.border}`,marginBottom:6,cursor:"grab",background:draggingId===block.id?"#f4f4f5":C.surface,transition:"background .1s",opacity:draggingId===block.id?.5:1}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background=draggingId===block.id?"#f4f4f5":C.surface}
            >
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:block.typeColor,flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:700,color:C.ink,flex:1}}>{block.name}</span>
                <button onClick={()=>addBlock(block)} style={{fontSize:11,background:C.lime,color:C.ink,border:"none",borderRadius:5,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>+</button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,background:block.color,color:block.typeColor,borderRadius:4,padding:"1px 6px",fontWeight:600}}>{block.type}</span>
                <span style={{fontSize:10,color:C.muted}}>{block.duration} min · {block.movements.length} movements</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Canvas */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {/* Header */}
        <div style={{background:C.surface,borderRadius:C.radius,border:`1px solid ${C.border}`,padding:"16px 20px",display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
          <input value={workoutName} onChange={e=>setWorkoutName(e.target.value)}
            style={{fontSize:18,fontWeight:800,color:C.ink,border:"none",background:"transparent",fontFamily:"inherit",outline:"none",flex:1,minWidth:200}}/>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:2,background:C.bg,borderRadius:8,padding:3,border:`1px solid ${C.border}`}}>
              {["individual","team"].map(t=>(
                <button key={t} onClick={()=>setTargetType(t)} style={{fontSize:12,padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,background:targetType===t?C.surface:C.bg,color:targetType===t?C.ink:C.sub,boxShadow:targetType===t?"0 1px 4px rgba(0,0,0,.08)":"none"}}>
                  {t==="individual"?"Athlete":"Team"}
                </button>
              ))}
            </div>
            <select value={targetId} onChange={e=>setTargetId(e.target.value)}
              style={{fontSize:12,padding:"6px 10px",border:`1px solid ${C.border}`,borderRadius:8,fontFamily:"inherit",background:C.surface,color:C.ink,outline:"none",cursor:"pointer"}}>
              {targetType==="individual"
                ? allAthletes.map(a=><option key={a.id} value={a.id}>{a.name}</option>)
                : allTeams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)
              }
            </select>
            {totalDuration>0&&<span style={{fontSize:12,color:C.muted,fontWeight:600}}>{totalDuration} min total</span>}
            <button onClick={()=>workoutBlocks.length>0&&setShowSend(true)} style={{fontSize:13,background:workoutBlocks.length>0?C.lime:C.bg,color:workoutBlocks.length>0?C.ink:C.muted,border:`1px solid ${workoutBlocks.length>0?C.limeDim:C.border}`,borderRadius:9,padding:"8px 18px",cursor:workoutBlocks.length>0?"pointer":"default",fontFamily:"inherit",fontWeight:700,transition:"all .15s"}}>
              Send →
            </button>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={handleDrop}
          style={{flex:1,background:dragOver?C.limeXl:C.surface,borderRadius:C.radius,border:`2px dashed ${dragOver?C.limeDim:C.border}`,padding:16,transition:"all .15s",overflow:"auto"}}
        >
          {workoutBlocks.length===0&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",minHeight:200,color:C.muted,gap:8}}>
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 5v14M5 12h14"/></svg>
              <span style={{fontSize:14,fontWeight:600}}>Drag blocks here or click + in the library</span>
              <span style={{fontSize:12}}>Build your workout by adding blocks in order</span>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {workoutBlocks.map((block,i)=>(
              <div key={block._uid} style={{background:C.surface,borderRadius:C.radiusSm,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <button onClick={()=>moveBlock(block._uid,"up")} disabled={i===0} style={{background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?C.border:C.muted,fontSize:10,lineHeight:1,padding:0}}>▲</button>
                    <button onClick={()=>moveBlock(block._uid,"down")} disabled={i===workoutBlocks.length-1} style={{background:"none",border:"none",cursor:i===workoutBlocks.length-1?"default":"pointer",color:i===workoutBlocks.length-1?C.border:C.muted,fontSize:10,lineHeight:1,padding:0}}>▼</button>
                  </div>
                  <div style={{width:28,height:28,borderRadius:7,background:block.color,display:"grid",placeItems:"center",flexShrink:0}}>
                    <div style={{width:8,height:8,borderRadius:2,background:block.typeColor}}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{block.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{block.type} · {block.duration} min</div>
                  </div>
                  <button onClick={()=>setExpandedBlock(expandedBlock===block._uid?null:block._uid)} style={{fontSize:11,background:C.bg,color:C.sub,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 9px",cursor:"pointer",fontFamily:"inherit"}}>
                    {expandedBlock===block._uid?"Collapse":"Movements"}
                  </button>
                  <button onClick={()=>removeBlock(block._uid)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:16,lineHeight:1,padding:"0 2px"}}>×</button>
                </div>
                {expandedBlock===block._uid&&(
                  <div style={{borderTop:`1px solid ${C.border}`,padding:"10px 16px",background:block.color+"30"}}>
                    <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Movements in this block</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {block.movements.map((m,j)=>(
                        <span key={j} style={{fontSize:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",color:C.sub}}>{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send Modal */}
      {showSend&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={e=>{if(e.target===e.currentTarget)setShowSend(false)}}>
          <div style={{background:C.surface,borderRadius:C.radius,padding:"28px 32px",width:440,boxShadow:"0 8px 48px rgba(0,0,0,.18)"}}>
            {sent
              ?<div style={{textAlign:"center",padding:"16px 0"}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:"#f0fdf4",border:"2px solid #16a34a",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg></div>
                <div style={{fontSize:20,fontWeight:800,color:C.ink,marginBottom:4}}>Program sent!</div>
                <div style={{fontSize:13,color:C.sub}}>Push notification queued for {target?.name||target?.name}</div>
              </div>
              :<>
                <div style={{fontSize:18,fontWeight:800,color:C.ink,marginBottom:4}}>Send Program</div>
                <div style={{fontSize:13,color:C.sub,marginBottom:20}}>Confirm assignment and trigger push notification</div>
                <div style={{background:C.bg,borderRadius:C.radiusSm,padding:"14px 16px",marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>Summary</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:13}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.sub}}>Workout</span><span style={{fontWeight:700,color:C.ink}}>{workoutName}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.sub}}>Recipient</span><span style={{fontWeight:700,color:C.ink}}>{target?.name||"—"}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.sub}}>Blocks</span><span style={{fontWeight:700,color:C.ink}}>{workoutBlocks.length} blocks · {totalDuration} min</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.sub}}>Notification</span><span style={{fontWeight:700,color:"#16a34a"}}>push_notify: program_ready</span></div>
                  </div>
                </div>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Coach notes for the athlete (optional)…"
                  style={{width:"100%",padding:"10px 12px",border:`1px solid ${C.border}`,borderRadius:C.radiusSm,fontSize:13,fontFamily:"inherit",resize:"none",height:72,outline:"none",boxSizing:"border-box",marginBottom:16,color:C.ink}}/>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <button onClick={()=>setShowSend(false)} style={{fontSize:13,background:C.bg,color:C.sub,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 18px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Cancel</button>
                  <button onClick={handleSend} style={{fontSize:13,background:C.lime,color:C.ink,border:"none",borderRadius:9,padding:"10px 22px",cursor:"pointer",fontFamily:"inherit",fontWeight:800}}>Confirm & Send →</button>
                </div>
              </>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VIDEO CARD ───────────────────────────────────────────────────────────────
// Autoplay muted loop on mount (Instagram-style). Falls back to gradient placeholder.
function VideoCard({ movement, compact = false }) {
  const videoRef = useRef(null);
  const [errored, setErrored] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    const play = () => v.play().catch(() => {});
    v.addEventListener("canplay", () => { setReady(true); play(); });
    return () => v.pause();
  }, [movement.video_url]);

  const gradients = {
    core: "linear-gradient(135deg,#c8e64e,#65a30d)",
    hips: "linear-gradient(135deg,#fb923c,#ea580c)",
    shoulders: "linear-gradient(135deg,#818cf8,#4f46e5)",
    lower_back: "linear-gradient(135deg,#f472b6,#db2777)",
    knees: "linear-gradient(135deg,#34d399,#059669)",
    ankles: "linear-gradient(135deg,#fbbf24,#d97706)",
  };
  const grad = gradients[movement.body?.[0]] || "linear-gradient(135deg,#e2e8f0,#94a3b8)";

  const h = compact ? 120 : 160;

  return (
    <div style={{ position: "relative", height: h, borderRadius: "10px 10px 0 0", overflow: "hidden", background: grad }}>
      {movement.video_url && !errored && (
        <video
          ref={videoRef}
          src={movement.video_url}
          onError={() => setErrored(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: ready ? 1 : 0, transition: "opacity .4s" }}
        />
      )}
      {/* Always-visible movement name overlay */}
      {(!ready || errored) && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: compact ? 22 : 28 }}>
            {"?"}
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.8)", fontWeight: 700, textAlign: "center", padding: "0 8px" }}>
            {errored ? "No video preview" : "Loading…"}
          </span>
        </div>
      )}
      {/* Type badge */}
      <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
        {movement.equipment && movement.equipment !== "none" && (
          <span style={{ fontSize: 9, background: "rgba(0,0,0,.5)", color: "#fff", borderRadius: 4, padding: "2px 5px", backdropFilter: "blur(4px)" }}>
            {movement.equipment}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── LIBRARY VIEW (with videos) ───────────────────────────────────────────────
function LibraryView() {
  const [bodyFilter, setBodyFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const bodies = ["all","core","hips","shoulders","lower_back","knees","ankles"];

  // Full movement list with real video URLs from DB
  const FULL_MOVEMENTS = [
    {name:"Tall Plank",body:["core","shoulders"],equipment:"none",super:["stability"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Plank.mp4",desc:"Full body isometric hold — shoulders stacked over wrists, body straight."},
    {name:"Cat-Cow",body:["lower_back","core"],equipment:"none",super:["mobility","ROM"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Cat-Cow.mp4",desc:"Spinal flexion/extension flow for lower back mobility."},
    {name:"Hip Flexor Stretch",body:["hips","lower_back"],equipment:"none",super:["flexibility","ROM"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Half_Kneeling_Hip_Flexor_Stretch.mp4",desc:"Half-kneeling lunge stretch targeting hip flexors and iliopsoas."},
    {name:"Squat",body:["hips","knees","ankles"],equipment:"none",super:["functional_strength"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Squat.mp4",desc:"Fundamental lower body strength pattern. Feet shoulder-width, chest tall."},
    {name:"Push-Up",body:["chest","shoulders","core"],equipment:"none",super:["functional_strength"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Push-Up.mp4",desc:"Upper body pressing pattern. Full lockout at top, chest near floor."},
    {name:"Bodyweight Hip Hinge",body:["hips","lower_back"],equipment:"none",super:["mobility","ROM"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/sign/movement-demos/hiphinge.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82NmJkOTZmMy05MTQ3LTQyNDMtODg5YS1iOTk2NTY4YzU4YWEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtb3ZlbWVudC1kZW1vcy9oaXBoaW5nZS5tcDQiLCJpYXQiOjE3NjIzOTExMjEsImV4cCI6MTc5MzkyNzEyMX0.knjp-DMZyM7lSFJyrRP95FBV4G2l5jqmkckEa9W6w7o",desc:"Hip hinge pattern — soft knee, hinge at hips, neutral spine."},
    {name:"Bridge w/ Squeeze",body:["hips","glutes"],equipment:"none",super:["functional_strength"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Bridge-w-Squeeze.mp4",desc:"Supine glute activation. Drive through heels, squeeze at top."},
    {name:"Split Squat",body:["hips","knees"],equipment:"none",super:["stability","functional_strength"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Split%20Squat.mp4",desc:"Single-leg strength pattern. Front shin vertical, back knee near floor."},
    {name:"Calf Raises",body:["ankles"],equipment:"none",super:["functional_strength"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Calf%20Raises.mp4",desc:"Ankle plantarflexion strength. Full range, pause at top."},
    {name:"Bodyweight Clamshell",body:["hips"],equipment:"none",super:["functional_strength"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Clamshell.mp4",desc:"Hip external rotation targeting glute medius. Control the return."},
    {name:"1-Leg RDL",body:["hips","lower_back","knees"],equipment:"none",super:["stability","functional_strength"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/1-Leg%20RDL.mp4",desc:"Single-leg hip hinge. Balance + posterior chain activation."},
    {name:"Chest Opener",body:["shoulders","chest"],equipment:"none",super:["flexibility","ROM"],video_url:"https://atvnjpwmydhqbxjgczti.supabase.co/storage/v1/object/public/movement-demos/Standing%20Chest%20Opener.mp4",desc:"Shoulder retraction and chest stretch. Arms behind back."},
    {name:"Side Plank",body:["core"],equipment:"none",super:["stability"],video_url:null,desc:"Lateral core isometric hold. Hips up, body straight."},
    {name:"Dead Bug",body:["core"],equipment:"none",super:["stability"],video_url:null,desc:"Supine core stability. Opposite arm/leg extend while lower back stays flat."},
    {name:"Bird Dog",body:["core","lower_back"],equipment:"none",super:["stability"],video_url:null,desc:"Quadruped balance drill. Extend opposite arm/leg, keep hips square."},
    {name:"Nordic Curl",body:["knees","hips"],equipment:"none",super:["functional_strength"],video_url:null,desc:"Eccentric hamstring strength. Highest ACL prehab value."},
    {name:"Inchworm",body:["lower_back","hips"],equipment:"none",super:["mobility"],video_url:null,desc:"Dynamic forward fold to plank. Full body mobility + activation."},
    {name:"Glute Bridge",body:["hips","glutes"],equipment:"none",super:["functional_strength"],video_url:null,desc:"Double-leg hip extension. Drive heels, neutral spine at top."},
    {name:"Arm Circles",body:["shoulders"],equipment:"none",super:["mobility","ROM"],video_url:null,desc:"Dynamic shoulder warm-up. Small to large circles, both directions."},
    {name:"Band Pull-Apart",body:["shoulders"],equipment:"band",super:["functional_strength"],video_url:null,desc:"Scapular retraction + shoulder health. Thumbs up, elbows soft."},
  ];

  const filtered = FULL_MOVEMENTS.filter(m =>
    (bodyFilter === "all" || m.body.includes(bodyFilter)) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search movements…"
          style={{ padding: "9px 14px", border: `1px solid ${C.border}`, borderRadius: C.radiusSm, fontSize: 13, fontFamily: "inherit", background: C.surface, outline: "none", color: C.ink, width: 220 }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {bodies.map(b => (
            <button key={b} onClick={() => setBodyFilter(b)} style={{ fontSize: 11, padding: "5px 11px", borderRadius: 6, border: `1px solid ${bodyFilter === b ? C.limeDim : C.border}`, background: bodyFilter === b ? C.limeXl : C.surface, color: bodyFilter === b ? C.ink : C.sub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              {b === "all" ? "All Areas" : b.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: C.muted, marginLeft: "auto" }}>{filtered.length} movements · {FULL_MOVEMENTS.filter(m => m.video_url).length} with video</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
        {filtered.map((m, i) => (
          <div key={i} style={{ background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer", transition: "box-shadow .15s, transform .1s" }}
            onClick={() => setSelected(selected?.name === m.name ? null : m)}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
            <VideoCard movement={m} compact />
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{m.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 5 }}>
                {m.body.map(b => <span key={b} style={{ fontSize: 9, background: C.limeXl, color: "#365314", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>{b.replace("_", " ")}</span>)}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {m.super.map(s => <span key={s} style={{ fontSize: 9, background: "#eff6ff", color: "#1d4ed8", borderRadius: 4, padding: "1px 5px" }}>{s.replace("_", " ")}</span>)}
              </div>
              {selected?.name === m.name && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.sub, lineHeight: 1.5 }}>{m.desc}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── UPLOADS VIEW ─────────────────────────────────────────────────────────────
function UploadsView() {
  const [uploadTab, setUploadTab] = useState("text");
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const sampleText = `Warm-up (5 min):\n- Cat-Cow x20\n- Hip Flexor Stretch 30s each\n- Calf Raises x15\n\nMain Block (20 min):\n- Squat 3x10 rest 60s\n- Push-Up 3x8 rest 60s\n- Hip Hinge 3x10 rest 45s\n- Side Plank 3x30s\n\nCooldown:\n- Hamstring Stretch 60s\n- Child's Pose 60s`;

  const parseText = () => {
    if (!text.trim()) return;
    setParsing(true);
    setTimeout(() => {
      setParsed({ movements: [
        { input: "Cat-Cow x20", matched: "Cat-Cow", confidence: "high", sets: 1, reps: 20 },
        { input: "Hip Flexor Stretch 30s", matched: "Hip Flexor Stretch", confidence: "high", sets: 1, duration: 30 },
        { input: "Calf Raises x15", matched: "Calf Raises", confidence: "high", sets: 1, reps: 15 },
        { input: "Squat 3x10", matched: "Squat", confidence: "high", sets: 3, reps: 10 },
        { input: "Push-Up 3x8", matched: "Push-Up", confidence: "high", sets: 3, reps: 8 },
        { input: "Hip Hinge 3x10", matched: "Bodyweight Hip Hinge", confidence: "medium", sets: 3, reps: 10 },
        { input: "Side Plank 3x30s", matched: "Side Plank", confidence: "high", sets: 3, duration: 30 },
        { input: "Hamstring Stretch", matched: "Hip Flexor Stretch", confidence: "medium", sets: 1, duration: 60 },
        { input: "Child's Pose", matched: "— No match", confidence: "low", sets: 1, duration: 60 },
      ], summary: "9 exercises parsed · 8 matched to library" });
      setParsing(false);
    }, 1400);
  };
  const confColor = { high: "#16a34a", medium: "#ca8a04", low: "#dc2626" };
  const confBg = { high: "#f0fdf4", medium: "#fefce8", low: "#fef2f2" };
  const tabs = [{ id: "text", label: "Text / Paste" }, { id: "image", label: "Photo / PDF" }, { id: "excel", label: "Excel / CSV" }];

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 20, background: C.surface, borderRadius: C.radiusSm, padding: 4, border: `1px solid ${C.border}`, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setUploadTab(t.id); setParsed(null); }} style={{ padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: uploadTab === t.id ? C.lime : "transparent", color: uploadTab === t.id ? C.ink : C.sub, transition: "all .15s" }}>{t.label}</button>
        ))}
      </div>
      {uploadTab === "text" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Paste workout</div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"Squat 3x10\nPush-Up 3x8\nPlank 45s…"}
              style={{ width: "100%", height: 260, padding: "12px 14px", border: `1px solid ${C.border}`, borderRadius: C.radiusSm, fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", color: C.ink, boxSizing: "border-box", lineHeight: 1.6 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => setText(sampleText)} style={{ fontSize: 12, background: C.bg, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit" }}>Load sample</button>
              <button onClick={parseText} disabled={!text.trim() || parsing} style={{ fontSize: 12, background: text.trim() && !parsing ? C.lime : C.bg, color: text.trim() && !parsing ? C.ink : C.muted, border: "none", borderRadius: 7, padding: "7px 16px", cursor: text.trim() && !parsing ? "pointer" : "default", fontFamily: "inherit", fontWeight: 700, flex: 1 }}>
                {parsing ? "Parsing…" : "Parse & Match →"}
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Matched to library</div>
            {!parsed && !parsing && <div style={{ height: 260, border: `2px dashed ${C.border}`, borderRadius: C.radiusSm, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 13 }}>Results appear here</div>}
            {parsing && <div style={{ height: 260, border: `2px dashed ${C.border}`, borderRadius: C.radiusSm, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 13, gap: 8 }}><div style={{ width: 18, height: 18, border: `2px solid ${C.border}`, borderTopColor: C.limeDim, borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Matching…</div>}
            {parsed && (
              <div style={{ border: `1px solid ${C.border}`, borderRadius: C.radiusSm, overflow: "hidden" }}>
                <div style={{ background: C.limeXl, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#365314", borderBottom: `1px solid ${C.border}` }}>{parsed.summary}</div>
                <div style={{ maxHeight: 220, overflow: "auto" }}>
                  {parsed.movements.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderBottom: i < parsed.movements.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: 10, background: confBg[m.confidence], color: confColor[m.confidence], borderRadius: 4, padding: "1px 5px", fontWeight: 700, minWidth: 40, textAlign: "center" }}>{m.confidence}</span>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{m.matched}</div><div style={{ fontSize: 10, color: C.muted }}>"{m.input}"</div></div>
                      <span style={{ fontSize: 10, color: C.sub }}>{m.sets && `${m.sets}×`}{m.reps ? m.reps : m.duration ? `${m.duration}s` : ""}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, fontSize: 12, background: C.lime, color: C.ink, border: "none", borderRadius: 7, padding: "8px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Save as Block</button>
                  <button style={{ flex: 1, fontSize: 12, background: C.bg, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px", cursor: "pointer", fontFamily: "inherit" }}>Open in Builder</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {uploadTab === "image" && (
        <div onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)}
          onDrop={e => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files[0]; if (f) setFileName(f.name); }}
          style={{ border: `2px dashed ${dragActive ? C.limeDim : C.border}`, borderRadius: C.radius, padding: "48px 32px", textAlign: "center", background: dragActive ? C.limeXl : C.surface, transition: "all .15s", cursor: "pointer" }}
          onClick={() => document.getElementById("imgUp").click()}>
          <input id="imgUp" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => e.target.files[0] && setFileName(e.target.files[0].name)} />
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth={1.5} style={{margin:"0 auto 12px",display:"block"}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{fileName ? "Ready: " + fileName : "Drop a photo or PDF"}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Whiteboard workouts, printed programs, PDF plans</div>
          {fileName && <button style={{ fontSize: 12, background: C.lime, color: C.ink, border: "none", borderRadius: 7, padding: "9px 20px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Parse with AI Vision →</button>}
        </div>
      )}
      {uploadTab === "excel" && (
        <div>
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: C.radius, padding: "32px", textAlign: "center", background: C.surface, marginBottom: 16, cursor: "pointer" }} onClick={() => document.getElementById("xlsUp").click()}>
            <input id="xlsUp" type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={e => e.target.files[0] && setFileName(e.target.files[0].name)} />
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth={1.5} style={{margin:"0 auto 8px",display:"block"}}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{fileName || "Upload Excel or CSV"}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Columns: Exercise, Sets, Reps, Duration, Rest</div>
          </div>
          <div style={{ background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {[["Your Column", "Maps to"], ["Exercise Name", "movement library match"], ["Sets", "sets"], ["Reps", "reps"], ["Time (s)", "duration_seconds"], ["Rest (s)", "rest_seconds"]].map(([a, b], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ padding: "9px 16px", background: i === 0 ? C.bg : C.surface, fontSize: i === 0 ? 10 : 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.muted : C.ink }}>{a}</div>
                <div style={{ padding: "9px 16px", background: i === 0 ? C.bg : C.surface, borderLeft: `1px solid ${C.border}`, fontSize: i === 0 ? 10 : 12, color: i === 0 ? C.muted : C.sub }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── ANALYTICS DATA ───────────────────────────────────────────────────────────
const ANALYTICS_DATA = {
  teamScoreTrend: [
    { date: "Nov 17", avg: 58, min: 41, max: 75 },
    { date: "Dec 2",  avg: 61, min: 44, max: 77 },
    { date: "Dec 18", avg: 63, min: 45, max: 79 },
    { date: "Jan 7",  avg: 65, min: 46, max: 80 },
    { date: "Jan 21", avg: 64, min: 41, max: 82 },
    { date: "Feb 5",  avg: 63, min: 41, max: 84 },
    { date: "Feb 19", avg: 65, min: 41, max: 86 },
    { date: "Mar 5",  avg: 64, min: 41, max: 72 },
  ],
  injuryHeatmap: [
    { region: "Lower Body", count: 6, athletes: ["Gabby","Steph","Maria","Amaury","Drew","Jack"], severity: "high" },
    { region: "Lower Back", count: 3, athletes: ["Gabby","Hannah","Drew"], severity: "medium" },
    { region: "Upper Body", count: 1, athletes: ["Annabelle"], severity: "low" },
    { region: "Other / Chronic", count: 2, athletes: ["Gabby","Amaury"], severity: "medium" },
  ],
  bodyRegionTeam: [
    { region: "Ankles", avg: 85 }, { region: "Knees", avg: 80 }, { region: "Core", avg: 73 },
    { region: "Hips", avg: 69 }, { region: "Chest", avg: 65 }, { region: "Arms", avg: 64 },
    { region: "Lower Back", avg: 61 }, { region: "Shoulders", avg: 59 },
  ],
  superMetrics: [
    { metric: "Mobility", avg: 68 }, { metric: "Func. Strength", avg: 65 },
    { metric: "Flexibility", avg: 60 }, { metric: "ROM", avg: 58 },
  ],
  athleteScores: [
    { name: "Gabby", scores: [59,64,69,72,64,59,62], trend: "+3" },
    { name: "Hannah", scores: [74,73,73,72,72,72,72], trend: "-2" },
    { name: "Steph", scores: [67,65,62,60,57,54,54], trend: "-13" },
    { name: "Amaury", scores: [86,82,78,74,72,70,70], trend: "-16" },
    { name: "Drew", scores: [64,64,64,64], trend: "0" },
    { name: "Jack", scores: [41], trend: "—" },
    { name: "Annabelle", scores: [72], trend: "—" },
  ],
};

// ─── ANALYTICS TAB ────────────────────────────────────────────────────────────


function AnalyticsTab() {
  const [athleteFilter, setAthleteFilter] = useState("all");

  const teamColors = { "Performance Group": "#c8e64e", "Rehab Track": "#fb923c", "Foundations": "#818cf8" };
  const severityColor = { high: "#dc2626", medium: "#ea580c", low: "#ca8a04" };
  const severityBg = { high: "#fef2f2", medium: "#fff7ed", low: "#fefce8" };

  const statCards = [
    { label: "Team Avg Score", value: "64", sub: "across 7 active athletes", color: sc(64) },
    { label: "Improving", value: "1", sub: "Gabby +3pts", color: "#16a34a" },
    { label: "Declining", value: "3", sub: "Steph, Amaury, Hannah", color: "#dc2626" },
    { label: "Active Injuries", value: "15", sub: "across 6 athletes", color: "#ea580c" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: C.radius, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Team score trend */}
        <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 16 }}>Team Score Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ANALYTICS_DATA.teamScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis domain={[30, 100]} tick={{ fontSize: 10, fill: C.muted }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <ReferenceLine y={70} stroke="#16a34a" strokeDasharray="4 2" strokeWidth={1} label={{ value: "target", fontSize: 9, fill: "#16a34a" }} />
              <Line type="monotone" dataKey="max" stroke="#c8e64e" strokeWidth={1} dot={false} strokeDasharray="3 2" name="Best" />
              <Line type="monotone" dataKey="avg" stroke={C.ink} strokeWidth={2.5} dot={{ r: 3, fill: C.ink }} name="Team Avg" />
              <Line type="monotone" dataKey="min" stroke="#fb923c" strokeWidth={1} dot={false} strokeDasharray="3 2" name="Lowest" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Body region averages */}
        <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 16 }}>Team Body Region Averages</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_DATA.bodyRegionTeam} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis type="category" dataKey="region" tick={{ fontSize: 10, fill: C.sub }} width={72} />
              <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="avg" radius={[0, 4, 4, 0]}
                fill="#c8e64e"
                label={{ position: "right", fontSize: 10, fill: C.muted }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Individual athlete trends */}
        <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 16 }}>Individual Trajectories</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ANALYTICS_DATA.athleteScores.map(a => {
              const latest = a.scores[a.scores.length - 1];
              const col = sc(latest);
              const diff = parseFloat(a.trend);
              return (
                <div key={a.name} style={{ display: "grid", gridTemplateColumns: "72px 1fr 80px 40px", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{a.name}</span>
                  <Spark data={a.scores} color={col} w={100} h={22} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: col }}>{latest}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: !isNaN(diff) && diff > 0 ? "#16a34a" : !isNaN(diff) && diff < 0 ? "#dc2626" : C.muted }}>
                    {a.trend}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Injury heatmap */}
        <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Injury Risk Heatmap</div>
          <div style={{ fontSize: 11, color: C.sub, marginBottom: 16 }}>Active injuries reported by athletes across body areas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {ANALYTICS_DATA.injuryHeatmap.map(row => (
              <div key={row.region}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{row.region}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: severityColor[row.severity] }}>{row.count} athletes</span>
                </div>
                <div style={{ height: 10, background: C.bg, borderRadius: 5 }}>
                  <div style={{ height: "100%", width: `${(row.count / 10) * 100}%`, background: severityColor[row.severity], borderRadius: 5, transition: "width .5s" }} />
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                  {row.athletes.map(n => <span key={n} style={{ fontSize: 9, background: severityBg[row.severity], color: severityColor[row.severity], borderRadius: 3, padding: "1px 5px", fontWeight: 600 }}>{n}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: C.radiusSm, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 2, display:"flex", alignItems:"center", gap:5 }}><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2.5}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>ACL Cluster — 3 Athletes</div>
            <div style={{ fontSize: 11, color: "#7f1d1d" }}>Gabby, Steph, Maria all report active ACL/MCL tears. Consider ACL Prehab Block as mandatory in next program cycle.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS TAB ─────────────────────────────────────────────────────────────
function ProgressTab({ athlete }) {
  const scores = athlete.history.map(s => Math.round(s * 100));
  const bodyRegions = [
    { region: "Core",        score: 73, teamAvg: 73 },
    { region: "Hips",        score: 68, teamAvg: 69 },
    { region: "Shoulders",   score: 60, teamAvg: 59 },
    { region: "Lower Back",  score: 55, teamAvg: 61 },
    { region: "Knees",       score: 78, teamAvg: 80 },
    { region: "Ankles",      score: 82, teamAvg: 85 },
  ];
  const injuryMap = {
    "49ca8f8e-00dc-4582-a92e-58212121f777": [
      {name:"ACL/MCL Tear – Left Knee",date:"2024-09",status:"active",severity:"high"},
      {name:"Meniscus – Left Knee",date:"2024-09",status:"active",severity:"high"},
      {name:"Lower Back Pain",date:"2024-11",status:"active",severity:"medium"},
      {name:"Shin Splints",date:"2023-06",status:"resolved",severity:"low"},
    ],
    "0812572d-48a9-40c9-bff8-bd5afc289d7d": [
      {name:"Lower Back Pain",date:"2025-01",status:"active",severity:"medium"},
    ],
    "818c56b1-a2fe-4e01-aab6-1e33e08ebc22": [
      {name:"ACL/MCL Tear – Right Knee",date:"2025-03",status:"active",severity:"high"},
    ],
  };
  const injuries = injuryMap[athlete.id] || [];
  const latest = scores[scores.length - 1];
  const first = scores[0];
  const netChange = latest - first;
  const severityColor = { high:"#dc2626", medium:"#ea580c", low:"#16a34a" };
  const severityBg = { high:"#fef2f2", medium:"#fff7ed", low:"#f0fdf4" };

  const chartData = scores.map((s, i) => ({ assessment: `A${i+1}`, score: s }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Score summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { label: "Current Score", value: latest ?? "—", color: latest ? sc(latest) : C.muted },
          { label: "Starting Score", value: first ?? "—", color: C.sub },
          { label: "Net Change", value: netChange >= 0 ? `+${netChange}` : netChange, color: netChange > 0 ? "#16a34a" : netChange < 0 ? "#dc2626" : C.muted },
        ].map(s => (
          <div key={s.label} style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Score trend */}
        <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 16 }}>Score Over Time</div>
          {scores.length > 1 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="assessment" tick={{ fontSize: 10, fill: C.muted }} />
                <YAxis domain={[30, 100]} tick={{ fontSize: 10, fill: C.muted }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} />
                <ReferenceLine y={70} stroke="#16a34a" strokeDasharray="4 2" strokeWidth={1} />
                <Line type="monotone" dataKey="score" stroke={sc(latest)} strokeWidth={2.5} dot={{ r: 4, fill: sc(latest) }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 13 }}>Need 2+ assessments for trend</div>
          )}
        </div>

        {/* Body region vs team */}
        <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Body Region vs Team Average</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontSize: 11, color: C.muted }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 3, background: sc(latest), borderRadius: 2 }} />{athlete.first_name}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 3, background: C.border, borderRadius: 2 }} />Team avg</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bodyRegions.map(r => (
              <div key={r.region}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>{r.region}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: r.score < r.teamAvg ? "#dc2626" : "#16a34a" }}>{r.score} <span style={{ color: C.muted, fontWeight: 400 }}>vs {r.teamAvg}</span></span>
                </div>
                <div style={{ position: "relative", height: 6, background: C.bg, borderRadius: 3 }}>
                  <div style={{ position: "absolute", height: "100%", width: `${r.teamAvg}%`, background: C.border, borderRadius: 3 }} />
                  <div style={{ position: "absolute", height: "100%", width: `${r.score}%`, background: sc(r.score), borderRadius: 3, opacity: 0.85 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Injury history */}
      <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, padding: "20px 22px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>Injury History</div>
        {injuries.length === 0 ? (
          <div style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: "16px 0" }}>No injuries on record</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {injuries.map((inj, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: C.radiusSm, background: inj.status === "active" ? severityBg[inj.severity] : C.bg, border: `1px solid ${inj.status === "active" ? severityColor[inj.severity] + "30" : C.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: inj.status === "active" ? severityColor[inj.severity] : "#94a3b8", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{inj.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Reported {inj.date}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: inj.status === "active" ? severityColor[inj.severity] : C.muted, background: inj.status === "active" ? severityBg[inj.severity] : C.bg, borderRadius: 5, padding: "2px 8px", border: `1px solid ${inj.status === "active" ? severityColor[inj.severity] + "40" : C.border}` }}>
                  {inj.status === "active" ? "Active" : "Resolved"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BUILDER MODAL (from Teams view) ─────────────────────────────────────────
function BuilderModal({ athlete, savedWorkouts, setSavedWorkouts, onClose, onSend }) {
  const [workoutName, setWorkoutName] = useState(`${athlete.name.split(" ")[0]}'s Workout`);
  const [workoutBlocks, setWorkoutBlocks] = useState([]);
  const [blockFilter, setBlockFilter] = useState("All");
  const [blockSearch, setBlockSearch] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [saved, setSaved] = useState(false);

  const blockTypes = ["All","Warm-up","Strength","Conditioning","Cool-down","Durability"];
  const filteredLib = BLOCK_LIBRARY.filter(b =>
    (blockFilter === "All" || b.type === blockFilter) &&
    b.name.toLowerCase().includes(blockSearch.toLowerCase())
  );
  const totalDuration = workoutBlocks.reduce((s, b) => s + (b.duration || 0), 0);

  const addBlock = b => { if (!workoutBlocks.find(x => x.id === b.id)) setWorkoutBlocks(p => [...p, {...b, _uid: Date.now() + Math.random()}]); };
  const removeBlock = uid => setWorkoutBlocks(p => p.filter(b => b._uid !== uid));
  const moveBlock = (uid, dir) => setWorkoutBlocks(p => {
    const idx = p.findIndex(b => b._uid === uid);
    if (dir === "up" && idx === 0) return p;
    if (dir === "down" && idx === p.length - 1) return p;
    const n = [...p]; [n[idx], n[dir === "up" ? idx-1 : idx+1]] = [n[dir === "up" ? idx-1 : idx+1], n[idx]];
    return n;
  });
  const handleDrop = e => { e.preventDefault(); setDragOver(false); const b = BLOCK_LIBRARY.find(b => b.id === parseInt(e.dataTransfer.getData("blockId"))); if (b) addBlock(b); };

  const saveWorkout = () => {
    if (!workoutBlocks.length) return;
    const w = { id: Date.now(), name: workoutName, blocks: workoutBlocks, duration: totalDuration, createdAt: new Date().toISOString(), tag: "individual", forAthlete: athlete.name };
    setSavedWorkouts(p => [w, ...p]);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.bg, borderRadius: C.radius, width: "90vw", maxWidth: 960, height: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 16px 64px rgba(0,0,0,.25)", overflow: "hidden" }}>
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px", borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.limeXl, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12, color: C.ink, flexShrink: 0 }}>
            {athlete.name.split(" ").map(n => n[0]).slice(0,2).join("")}
          </div>
          <div style={{ flex: 1 }}>
            <input value={workoutName} onChange={e => setWorkoutName(e.target.value)}
              style={{ fontSize: 17, fontWeight: 800, color: C.ink, border: "none", background: "transparent", fontFamily: "inherit", outline: "none", width: "100%" }} />
            <div style={{ fontSize: 11, color: C.muted }}>For {athlete.name}{athlete.injuries?.length ? ` · ${athlete.injuries.length} active injuries` : ""}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {totalDuration > 0 && <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, alignSelf: "center" }}>{totalDuration} min</span>}
            <button onClick={saveWorkout} style={{ fontSize: 12, background: saved ? "#f0fdf4" : C.limeXl, color: saved ? "#16a34a" : C.ink, border: `1px solid ${saved ? "#bbf7d0" : C.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
              {saved ? "Saved" : "Save to Library"}
            </button>
            <button onClick={() => workoutBlocks.length > 0 && onSend({ name: workoutName, blocks: workoutBlocks, duration: totalDuration })} style={{ fontSize: 12, background: workoutBlocks.length > 0 ? C.lime : C.bg, color: workoutBlocks.length > 0 ? C.ink : C.muted, border: "none", borderRadius: 8, padding: "8px 16px", cursor: workoutBlocks.length > 0 ? "pointer" : "default", fontFamily: "inherit", fontWeight: 700 }}>
              Send to {athlete.name.split(" ")[0]} →
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, padding: "0 4px" }}>×</button>
          </div>
        </div>
        {/* Modal body */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", flex: 1, overflow: "hidden" }}>
          {/* Block library */}
          <div style={{ borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden", background: C.surface }}>
            <div style={{ padding: "12px 12px 10px", borderBottom: `1px solid ${C.border}` }}>
              <input value={blockSearch} onChange={e => setBlockSearch(e.target.value)} placeholder="Search blocks…"
                style={{ width: "100%", padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 12, fontFamily: "inherit", background: C.bg, outline: "none", color: C.ink, boxSizing: "border-box", marginBottom: 7 }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {blockTypes.map(t => (
                  <button key={t} onClick={() => setBlockFilter(t)} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, border: `1px solid ${blockFilter === t ? C.limeDim : C.border}`, background: blockFilter === t ? C.limeXl : C.bg, color: blockFilter === t ? C.ink : C.sub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
              {filteredLib.map(block => (
                <div key={block.id} draggable
                  onDragStart={e => { e.dataTransfer.setData("blockId", block.id); setDraggingId(block.id); }}
                  onDragEnd={() => setDraggingId(null)}
                  style={{ padding: "9px 11px", borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 5, cursor: "grab", background: C.surface, opacity: draggingId === block.id ? .5 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = C.surface}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.typeColor }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.ink, flex: 1 }}>{block.name}</span>
                    <button onClick={() => addBlock(block)} style={{ fontSize: 11, background: C.lime, color: C.ink, border: "none", borderRadius: 4, padding: "1px 6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>+</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, background: block.color, color: block.typeColor, borderRadius: 3, padding: "1px 5px", fontWeight: 600 }}>{block.type}</span>
                    <span style={{ fontSize: 9, color: C.muted }}>{block.duration}m · {block.movements.length} mvts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
            style={{ flex: 1, overflow: "auto", padding: 16, background: dragOver ? C.limeXl : C.bg, transition: "background .15s" }}>
            {workoutBlocks.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: C.muted, gap: 8 }}>
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 5v14M5 12h14" /></svg>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Drag blocks here or click +</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {workoutBlocks.map((block, i) => (
                  <div key={block._uid} style={{ background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <button onClick={() => moveBlock(block._uid, "up")} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? C.border : C.muted, fontSize: 9, padding: 0, lineHeight: 1 }}>▲</button>
                        <button onClick={() => moveBlock(block._uid, "down")} disabled={i === workoutBlocks.length-1} style={{ background: "none", border: "none", cursor: i === workoutBlocks.length-1 ? "default" : "pointer", color: i === workoutBlocks.length-1 ? C.border : C.muted, fontSize: 9, padding: 0, lineHeight: 1 }}>▼</button>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: block.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 1, background: block.typeColor }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{block.name}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>{block.type} · {block.duration} min</div>
                      </div>
                      <button onClick={() => setExpandedBlock(expandedBlock === block._uid ? null : block._uid)} style={{ fontSize: 11, background: C.bg, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>
                        {expandedBlock === block._uid ? "Hide" : "Movements"}
                      </button>
                      <button onClick={() => removeBlock(block._uid)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 15, lineHeight: 1 }}>×</button>
                    </div>
                    {expandedBlock === block._uid && (
                      <div style={{ borderTop: `1px solid ${C.border}`, padding: "8px 14px", background: block.color + "20" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {block.movements.map((m, j) => (
                            <span key={j} style={{ fontSize: 11, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5, padding: "3px 8px", color: C.sub }}>{m}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SEND MODAL ───────────────────────────────────────────────────────────────
function SendModal({ athlete, savedWorkouts, onClose, onSent }) {
  const [mode, setMode] = useState("ai"); // ai | library
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onSent(); onClose(); }, 2000);
  };

  const payload = mode === "ai"
    ? { name: "AI-Generated Personalized 12-Week Program", type: "ai_program", duration: "12 weeks" }
    : selectedWorkout
      ? { name: selectedWorkout.name, type: "coach_workout", duration: `${selectedWorkout.duration} min` }
      : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, borderRadius: C.radius, padding: "28px 32px", width: 480, boxShadow: "0 8px 48px rgba(0,0,0,.2)" }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #16a34a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginBottom: 4 }}>Sent!</div>
            <div style={{ fontSize: 13, color: C.sub }}>Push notification queued for {athlete.name}</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>Send to {athlete.name.split(" ")[0]}</div>
                <div style={{ fontSize: 12, color: C.muted }}>Choose what to send</div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20 }}>×</button>
            </div>

            {/* Mode picker */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setMode("ai")} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${mode === "ai" ? C.limeDim : C.border}`, background: mode === "ai" ? C.limeXl : C.bg, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.ink, marginBottom: 2 }}>AI Program</div>
                <div style={{ fontSize: 11, color: C.sub }}>Send their existing personalized 12-week plan</div>
              </button>
              <button onClick={() => setMode("library")} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${mode === "library" ? C.limeDim : C.border}`, background: mode === "library" ? C.limeXl : C.bg, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.ink, marginBottom: 2 }}>From Library</div>
                <div style={{ fontSize: 11, color: C.sub }}>{savedWorkouts.length > 0 ? `Pick from ${savedWorkouts.length} saved workouts` : "No saved workouts yet"}</div>
              </button>
            </div>

            {/* Library picker */}
            {mode === "library" && (
              <div style={{ marginBottom: 14 }}>
                {savedWorkouts.length === 0 ? (
                  <div style={{ padding: "14px", background: C.bg, borderRadius: C.radiusSm, fontSize: 12, color: C.muted, textAlign: "center" }}>
                    No saved workouts yet — build one first using the Workout Builder
                  </div>
                ) : (
                  <div style={{ maxHeight: 160, overflow: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                    {savedWorkouts.map(w => (
                      <div key={w.id} onClick={() => setSelectedWorkout(w)}
                        style={{ padding: "10px 12px", borderRadius: 8, border: `2px solid ${selectedWorkout?.id === w.id ? C.limeDim : C.border}`, background: selectedWorkout?.id === w.id ? C.limeXl : C.bg, cursor: "pointer" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{w.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{w.blocks.length} blocks · {w.duration} min{w.forAthlete ? ` · built for ${w.forAthlete.split(" ")[0]}` : ""}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {payload && (
              <div style={{ background: C.bg, borderRadius: C.radiusSm, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Will send</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub }}>To</span><span style={{ fontWeight: 700, color: C.ink }}>{athlete.name}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub }}>Workout</span><span style={{ fontWeight: 700, color: C.ink }}>{payload.name}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub }}>Notification</span><span style={{ fontWeight: 600, color: "#16a34a", fontSize: 11 }}>program_ready → push notify</span></div>
                </div>
              </div>
            )}

            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Coach notes (optional)…"
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: C.radiusSm, fontSize: 12, fontFamily: "inherit", resize: "none", height: 60, outline: "none", boxSizing: "border-box", marginBottom: 14, color: C.ink }} />

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{ fontSize: 13, background: C.bg, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSend} disabled={mode === "library" && !selectedWorkout}
                style={{ fontSize: 13, background: (mode === "ai" || selectedWorkout) ? C.lime : C.bg, color: (mode === "ai" || selectedWorkout) ? C.ink : C.muted, border: "none", borderRadius: 9, padding: "10px 22px", cursor: (mode === "ai" || selectedWorkout) ? "pointer" : "default", fontFamily: "inherit", fontWeight: 800 }}>
                Confirm & Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WORKOUT LIBRARY VIEW ─────────────────────────────────────────────────────
function WorkoutLibraryView({ savedWorkouts, setSavedWorkouts }) {
  const [filter, setFilter] = useState("all"); // all | team | individual
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  const filtered = savedWorkouts.filter(w =>
    (filter === "all" || w.tag === filter) &&
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteWorkout = id => { setSavedWorkouts(p => p.filter(w => w.id !== id)); setDeleting(null); };

  const typeColors = { "Warm-up": "#16a34a", "Strength": "#2563eb", "Conditioning": "#ca8a04", "Cool-down": "#7c3aed", "Durability": "#db2777" };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 2, background: C.surface, borderRadius: C.radiusSm, padding: 4, border: `1px solid ${C.border}` }}>
          {["all","team","individual"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: filter === f ? C.lime : "transparent", color: filter === f ? C.ink : C.sub }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search saved workouts…"
          style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: C.radiusSm, fontSize: 12, fontFamily: "inherit", background: C.surface, outline: "none", color: C.ink, width: 200 }} />
        <span style={{ fontSize: 12, color: C.muted, marginLeft: "auto" }}>{filtered.length} saved workout{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {savedWorkouts.length === 0 ? (
        <div style={{ background: C.surface, borderRadius: C.radius, border: `2px dashed ${C.border}`, padding: "64px 32px", textAlign: "center" }}>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth={1.5} style={{ margin: "0 auto 12px", display: "block" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.muted, marginBottom: 6 }}>No saved workouts yet</div>
          <div style={{ fontSize: 13, color: C.muted }}>Build a workout in the Workout Builder and click "Save to Library"</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: C.muted, fontSize: 13 }}>No workouts match your filter</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
          {filtered.map(w => (
            <div key={w.id} style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, flex: 1, paddingRight: 8 }}>{w.name}</div>
                  <button onClick={() => setDeleting(w.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</button>
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
                  <span>{w.blocks.length} blocks</span>
                  <span>·</span>
                  <span>{w.duration} min</span>
                  {w.forAthlete && <><span>·</span><span style={{ color: C.sub }}>{w.forAthlete.split(" ")[0]}</span></>}
                  <span style={{ marginLeft: "auto", background: w.tag === "team" ? C.limeXl : "#eff6ff", color: w.tag === "team" ? "#365314" : "#1d4ed8", borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>{w.tag}</span>
                </div>
              </div>
              <div style={{ padding: "10px 18px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                  {w.blocks.map((b, i) => (
                    <span key={i} style={{ fontSize: 10, background: b.color || C.bg, color: typeColors[b.type] || C.sub, borderRadius: 4, padding: "2px 7px", fontWeight: 600, border: `1px solid ${b.color || C.border}` }}>{b.name}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ flex: 1, fontSize: 11, background: C.lime, color: C.ink, border: "none", borderRadius: 7, padding: "7px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Send to Athlete</button>
                  <button style={{ flex: 1, fontSize: 11, background: C.bg, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 7, padding: "7px", cursor: "pointer", fontFamily: "inherit" }}>Open in Builder</button>
                </div>
              </div>
              {/* Delete confirm */}
              {deleting === w.id && (
                <div style={{ borderTop: `1px solid #fecaca`, background: "#fef2f2", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>Delete this workout?</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setDeleting(null)} style={{ fontSize: 11, background: "#fff", color: C.sub, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                    <button onClick={() => deleteWorkout(w.id)} style={{ fontSize: 11, background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SESSIONS DATA ────────────────────────────────────────────────────────────
const BLOCK_MOVEMENTS_DETAIL = {
  "Warm-up Set A":    [{name:"Cat-Cow",sets:1,reps:20,rest:null},{name:"Arm Circles",sets:1,reps:20,rest:null},{name:"Bodyweight Lateral Squat",sets:1,reps:12,rest:null},{name:"Calf Raises",sets:2,reps:15,rest:30}],
  "Warm-up Set B":    [{name:"Hip Flexor Stretch",sets:1,duration:30,rest:null},{name:"Glute Bridge",sets:2,reps:12,rest:30},{name:"Inchworm",sets:1,reps:6,rest:null},{name:"Jumping Jacks",sets:1,reps:30,rest:null}],
  "Warm-up Set C":    [{name:"World's Greatest Stretch",sets:1,reps:5,rest:null},{name:"Leg Swings",sets:1,reps:15,rest:null},{name:"Ankle Circles",sets:1,reps:10,rest:null},{name:"Thoracic Rotation",sets:1,reps:10,rest:null}],
  "Strength Set A":   [{name:"Squat",sets:3,reps:10,rest:60},{name:"Bodyweight Hip Hinge",sets:3,reps:8,rest:60},{name:"Push-Up",sets:3,reps:8,rest:60},{name:"Bodyweight Row",sets:3,reps:8,rest:60},{name:"Bridge w/ Squeeze",sets:3,reps:12,rest:45},{name:"Side Plank",sets:3,duration:30,rest:45}],
  "Strength Set B":   [{name:"Split Squat",sets:3,reps:8,rest:60},{name:"Single-Leg Deadlift",sets:3,reps:8,rest:60},{name:"Push-Up w/ Pause",sets:3,reps:6,rest:60},{name:"TRX Row",sets:3,reps:10,rest:60},{name:"Pallof Press",sets:3,reps:10,rest:45}],
  "Conditioning A":   [{name:"High Knees",sets:4,duration:30,rest:30},{name:"Mountain Climbers",sets:4,duration:30,rest:30},{name:"Squat Jumps",sets:4,duration:30,rest:30}],
  "Conditioning B":   [{name:"Burpees",sets:4,duration:30,rest:30},{name:"Lateral Shuffles",sets:4,duration:30,rest:30},{name:"Plank to Push-Up",sets:4,duration:30,rest:30}],
  "Cool-down A":      [{name:"Hip Flexor Stretch",sets:1,duration:60,rest:null},{name:"Hamstring Stretch",sets:1,duration:60,rest:null},{name:"Thoracic Rotation",sets:1,duration:30,rest:null},{name:"Child's Pose",sets:1,duration:60,rest:null}],
  "Cool-down B":      [{name:"Pigeon Pose",sets:1,duration:90,rest:null},{name:"IT Band Stretch",sets:1,duration:60,rest:null},{name:"Chest Opener",sets:1,duration:30,rest:null},{name:"90/90 Hip Stretch",sets:1,duration:60,rest:null}],
  "Durability Block V1":[{name:"Cat-Cow",sets:1,reps:20,rest:null},{name:"Calf Raises",sets:2,reps:15,rest:30},{name:"Hip Flexor Stretch",sets:1,duration:30,rest:null},{name:"Squat",sets:3,reps:10,rest:45},{name:"Push-Up",sets:3,reps:8,rest:45},{name:"High Knees",sets:2,duration:30,rest:20},{name:"Mountain Climbers",sets:2,duration:30,rest:20}],
  "Durability Block V2":[{name:"All Fours Iso",sets:3,duration:30,rest:15},{name:"Tall Plank",sets:3,duration:30,rest:15},{name:"Hip Hinge",sets:3,reps:10,rest:45},{name:"Bridge",sets:3,reps:12,rest:30},{name:"Pallof Press",sets:3,reps:10,rest:45},{name:"Dead Bug",sets:3,reps:8,rest:30},{name:"Side Plank",sets:3,duration:30,rest:30}],
  "ACL Prehab Block": [{name:"Nordic Curl",sets:3,reps:5,rest:90},{name:"Single-Leg Squat",sets:3,reps:8,rest:60},{name:"Terminal Knee Ext",sets:3,reps:15,rest:30},{name:"Lateral Band Walk",sets:3,reps:12,rest:30},{name:"Clamshell",sets:3,reps:15,rest:30},{name:"Glute Bridge",sets:3,reps:12,rest:30}],
  "Lower Back Stability":[{name:"Dead Bug",sets:3,reps:8,rest:30},{name:"Bird Dog",sets:3,reps:10,rest:30},{name:"Cat-Cow",sets:1,reps:20,rest:null},{name:"Pallof Press",sets:3,reps:10,rest:45},{name:"Plank",sets:3,duration:30,rest:30}],
  "Shoulder Health Block":[{name:"Band Pull-Apart",sets:3,reps:15,rest:30},{name:"Face Pull",sets:3,reps:15,rest:30},{name:"Prone Y-T-W",sets:2,reps:10,rest:30},{name:"Sleeper Stretch",sets:1,duration:60,rest:null},{name:"Cross-body Stretch",sets:1,duration:30,rest:null}],
};

const SESSIONS_DATA = [
  { id:1, type:"team", team:"Performance Group", teamColor:"#c8e64e", date:"2026-03-05", title:"Strength A + Durability", blocks:["Warm-up Set A","Strength Set A","Durability Block V2","Cool-down A"], duration:52, athletes:["Gabby","Hannah","Drew"], status:"completed", avgRpe:7.2, notes:"Strong session. Gabby hit PB on squats." },
  { id:2, type:"team", team:"Rehab Track", teamColor:"#fb923c", date:"2026-03-04", title:"ACL Prehab + Lower Back", blocks:["Warm-up Set B","ACL Prehab Block","Lower Back Stability","Cool-down B"], duration:40, athletes:["Steph","Amaury","Jack"], status:"completed", avgRpe:5.8, notes:"Amaury reported mild IT band discomfort post-session." },
  { id:3, type:"individual", athlete:"Gabby Rizika", date:"2026-03-05", title:"Personalized Durability W1D2", blocks:["Warm-up Set A","Durability Block V1","Cool-down A"], duration:28, status:"completed", rpe:6, notes:null },
  { id:4, type:"individual", athlete:"Hannah Steadman", date:"2026-03-04", title:"Personalized Durability W1D1", blocks:["Warm-up Set B","Durability Block V2","Cool-down B"], duration:25, status:"completed", rpe:5, notes:null },
  { id:5, type:"team", team:"Performance Group", teamColor:"#c8e64e", date:"2026-03-03", title:"Conditioning B", blocks:["Warm-up Set C","Conditioning B","Cool-down A"], duration:35, athletes:["Gabby","Hannah","Drew"], status:"completed", avgRpe:8.1, notes:null },
  { id:6, type:"individual", athlete:"Steph Xu", date:"2026-03-02", title:"Personalized Durability W1D4", blocks:["Warm-up Set A","ACL Prehab Block","Cool-down B"], duration:30, status:"completed", rpe:7, notes:"Knee felt stable today." },
  { id:7, type:"team", team:"Performance Group", teamColor:"#c8e64e", date:"2026-03-08", title:"Strength B + Conditioning A", blocks:["Warm-up Set B","Strength Set B","Conditioning A","Cool-down A"], duration:58, athletes:["Gabby","Hannah","Drew"], status:"scheduled" },
  { id:8, type:"team", team:"Rehab Track", teamColor:"#fb923c", date:"2026-03-09", title:"ACL Prehab + Shoulder Health", blocks:["Warm-up Set A","ACL Prehab Block","Shoulder Health Block","Cool-down B"], duration:45, athletes:["Steph","Maria","Amaury","Jack"], status:"scheduled" },
];

// ─── SESSIONS TAB ─────────────────────────────────────────────────────────────
function SessionsTab() {
  const [filter, setFilter] = useState("all");
  const [openSession, setOpenSession] = useState(null);
  const [openBlock, setOpenBlock] = useState(null); // "sessionId-blockName"
  const [tvMode, setTvMode] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState({ title:"", date:"", type:"team", team:"Performance Group", athlete:"Gabby Rizika", blocks:[] });
  const [sessions, setSessions] = useState(SESSIONS_DATA);

  const sorted = [...sessions].sort((a,b) => new Date(b.date) - new Date(a.date));
  const filtered = sorted.filter(s => filter === "all" || s.type === filter);
  const completed = filtered.filter(s => s.status === "completed");
  const upcoming = filtered.filter(s => s.status === "scheduled");

  const rpeColor = rpe => rpe > 7 ? "#ea580c" : rpe > 5 ? "#ca8a04" : "#16a34a";

  const addSession = () => {
    if (!newSession.title || !newSession.date) return;
    setSessions(p => [...p, { ...newSession, id: Date.now(), status: "scheduled", blocks: newSession.blocks.length ? newSession.blocks : ["Warm-up Set A","Durability Block V1","Cool-down A"] }]);
    setShowAddForm(false);
    setNewSession({ title:"", date:"", type:"team", team:"Performance Group", athlete:"Gabby Rizika", blocks:[] });
  };

  const SessionRow = ({ s }) => {
    const isOpen = openSession === s.id;
    const rpe = s.avgRpe || s.rpe;
    return (
      <div style={{ background: C.surface, borderRadius: C.radiusSm, border: `1px solid ${isOpen ? C.limeDim : C.border}`, marginBottom: 6, overflow: "hidden", transition: "border-color .15s" }}>
        <div onClick={() => setOpenSession(isOpen ? null : s.id)}
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = C.bg}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 44, textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{new Date(s.date).getDate()}</div>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>{new Date(s.date).toLocaleDateString("en-US",{month:"short"})}</div>
          </div>
          <div style={{ width: 6, height: 36, borderRadius: 3, background: s.type === "team" ? (s.teamColor || C.lime) : "#818cf8", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{s.type === "team" ? `${s.team} · ${s.athletes?.length} athletes` : s.athlete} · {s.duration} min · {s.blocks.length} blocks</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {s.status === "completed" && rpe != null && (
              <div style={{ textAlign: "center", minWidth: 36 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: rpeColor(rpe), lineHeight: 1 }}>{rpe}</div>
                <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>RPE</div>
              </div>
            )}
            <span style={{ fontSize: 11, borderRadius: 6, padding: "3px 9px", fontWeight: 700, background: s.status === "completed" ? "#f0fdf4" : "#eff6ff", color: s.status === "completed" ? "#16a34a" : "#2563eb" }}>
              {s.status === "completed" ? "Done" : "Upcoming"}
            </span>
            {s.status === "scheduled" && (
              <button onClick={e => { e.stopPropagation(); setTvMode(s); }}
                style={{ fontSize: 11, background: C.ink, color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                Cast
              </button>
            )}
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2.5} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {isOpen && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 18px" }}>
            {/* Notes + athletes row */}
            <div style={{ display: "grid", gridTemplateColumns: s.type === "team" ? "1fr 1fr" : "1fr", gap: 16, marginBottom: 14 }}>
              {s.notes && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Coach Notes</div>
                  <div style={{ fontSize: 12, color: C.sub, background: C.bg, borderRadius: 7, padding: "8px 10px", lineHeight: 1.5 }}>{s.notes}</div>
                </div>
              )}
              {s.type === "team" && s.athletes && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Athletes</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {s.athletes.map(a => <span key={a} style={{ fontSize: 11, background: C.limeXl, color: C.ink, borderRadius: 5, padding: "3px 8px", fontWeight: 600 }}>{a}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Blocks — expandable to movement level */}
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Blocks & Movements</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {s.blocks.map((blockName, bi) => {
                const key = `${s.id}-${blockName}`;
                const isBlockOpen = openBlock === key;
                const movements = BLOCK_MOVEMENTS_DETAIL[blockName] || [];
                const lib = BLOCK_LIBRARY.find(b => b.name === blockName);
                return (
                  <div key={bi} style={{ borderRadius: C.radiusSm, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                    <div onClick={() => setOpenBlock(isBlockOpen ? null : key)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", cursor: "pointer", background: isBlockOpen ? C.limeXl : C.bg }}
                      onMouseEnter={e => !isBlockOpen && (e.currentTarget.style.background = C.surface)}
                      onMouseLeave={e => !isBlockOpen && (e.currentTarget.style.background = C.bg)}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: lib?.typeColor || C.muted, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.ink, flex: 1 }}>{blockName}</span>
                      <span style={{ fontSize: 10, color: C.muted }}>{movements.length} movements</span>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2.5} style={{ transform: isBlockOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    {isBlockOpen && (
                      <div style={{ borderTop: `1px solid ${C.border}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 60px 60px", gap: 0, padding: "6px 14px 4px", fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                          <span>Movement</span><span style={{textAlign:"center"}}>Sets</span><span style={{textAlign:"center"}}>Reps</span><span style={{textAlign:"center"}}>Duration</span><span style={{textAlign:"center"}}>Rest</span>
                        </div>
                        {movements.map((mv, mi) => (
                          <div key={mi} style={{ display: "grid", gridTemplateColumns: "1fr 60px 60px 60px 60px", gap: 0, padding: "7px 14px", borderBottom: mi < movements.length-1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}
                            onMouseEnter={e => e.currentTarget.style.background = C.bg}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <span style={{ fontSize: 12, color: C.ink, fontWeight: 500 }}>{mv.name}</span>
                            <span style={{ fontSize: 12, color: C.sub, textAlign: "center", fontWeight: 600 }}>{mv.sets}</span>
                            <span style={{ fontSize: 12, color: C.sub, textAlign: "center" }}>{mv.reps ?? "—"}</span>
                            <span style={{ fontSize: 12, color: C.sub, textAlign: "center" }}>{mv.duration ? `${mv.duration}s` : "—"}</span>
                            <span style={{ fontSize: 12, color: C.sub, textAlign: "center" }}>{mv.rest ? `${mv.rest}s` : "—"}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 2, background: C.surface, borderRadius: C.radiusSm, padding: 4, border: `1px solid ${C.border}` }}>
          {["all","team","individual"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: filter === f ? C.lime : "transparent", color: filter === f ? C.ink : C.sub }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAddForm(true)} style={{ fontSize: 12, background: C.lime, color: C.ink, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>
          Schedule Session
        </button>
        <div style={{ fontSize: 13, color: C.muted, marginLeft: "auto" }}>{completed.length} completed · {upcoming.length} upcoming</div>
      </div>

      {/* Add session form */}
      {showAddForm && (
        <div style={{ background: C.surface, borderRadius: C.radius, border: `1px solid ${C.limeDim}`, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, marginBottom: 14 }}>Schedule New Session</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>Title</div>
              <input value={newSession.title} onChange={e => setNewSession(p => ({...p, title: e.target.value}))} placeholder="e.g. Strength A + Durability"
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", color: C.ink, boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>Date</div>
              <input type="date" value={newSession.date} onChange={e => setNewSession(p => ({...p, date: e.target.value}))}
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", color: C.ink, boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>Type</div>
              <select value={newSession.type} onChange={e => setNewSession(p => ({...p, type: e.target.value}))}
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", color: C.ink, background: C.surface }}>
                <option value="team">Team</option>
                <option value="individual">Individual</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={addSession} style={{ fontSize: 12, background: C.lime, color: C.ink, border: "none", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Add</button>
              <button onClick={() => setShowAddForm(false)} style={{ fontSize: 12, background: C.bg, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb" }} />Upcoming
          </div>
          {upcoming.map(s => <SessionRow key={s.id} s={s} />)}
        </div>
      )}

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />Session History
          <span style={{ fontSize: 10, fontWeight: 500, color: C.muted }}>— RPE collected from athlete app surveys</span>
        </div>
        {completed.map(s => <SessionRow key={s.id} s={s} />)}
      </div>

      {tvMode && <TVDisplay session={tvMode} onClose={() => setTvMode(null)} />}
    </div>
  );
}

// ─── TV DISPLAY (table layout) ────────────────────────────────────────────────
function TVDisplay({ session, onClose }) {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const fmtTime = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  useEffect(() => {
    let iv; if (running) iv = setInterval(() => setTimer(t => t+1), 1000);
    return () => clearInterval(iv);
  }, [running]);

  const blocks = session.blocks.map(name => ({
    name,
    movements: BLOCK_MOVEMENTS_DETAIL[name] || [],
    lib: BLOCK_LIBRARY.find(b => b.name === name),
  }));

  const typeColors = { "Warm-up":"#16a34a","Strength":"#2563eb","Conditioning":"#ca8a04","Cool-down":"#7c3aed","Durability":"#db2777" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0a", zIndex: 9999, display: "flex", flexDirection: "column", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#fff" }}>
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "14px 40px", borderBottom: "1px solid rgba(255,255,255,.1)", flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, background: C.lime, borderRadius: 7, display: "grid", placeItems: "center", marginRight: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 900, color: C.ink }}>D</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-.5px" }}>{session.title}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
            {session.type === "team" ? `${session.team} · ${session.athletes?.join(", ")}` : session.athlete} · {session.duration} min
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: running ? C.lime : "rgba(255,255,255,.3)", fontVariantNumeric: "tabular-nums" }}>{fmtTime(timer)}</div>
          <button onClick={() => setRunning(r => !r)} style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>
            {running ? "Pause" : "Start"}
          </button>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.6)", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Exit</button>
        </div>
      </div>

      {/* Workout table */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {blocks.map((block, bi) => {
            const blockColor = typeColors[block.lib?.type] || "rgba(255,255,255,.4)";
            return (
              <div key={bi}>
                {/* Block header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: blockColor }} />
                  <span style={{ fontSize: 18, fontWeight: 900, color: blockColor, textTransform: "uppercase", letterSpacing: ".08em" }}>{block.name}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.3)" }}>{block.movements.length} movements · {block.lib?.duration ?? "—"} min</span>
                </div>
                {/* Movement table */}
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)" }}>
                  {/* Column headers */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 100px 90px", padding: "10px 20px", background: "rgba(255,255,255,.06)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em" }}>
                    <span>Movement</span><span style={{textAlign:"center"}}>Sets</span><span style={{textAlign:"center"}}>Reps</span><span style={{textAlign:"center"}}>Duration</span><span style={{textAlign:"center"}}>Rest</span>
                  </div>
                  {block.movements.length === 0 ? (
                    <div style={{ padding: "16px 20px", fontSize: 14, color: "rgba(255,255,255,.25)", textAlign: "center" }}>No movement detail available</div>
                  ) : block.movements.map((mv, mi) => (
                    <div key={mi} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 100px 90px", padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,.07)", alignItems: "center" }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{mv.name}</span>
                      <span style={{ fontSize: 24, fontWeight: 900, color: C.lime, textAlign: "center" }}>{mv.sets}</span>
                      <span style={{ fontSize: 24, fontWeight: 900, color: mv.reps ? "#fff" : "rgba(255,255,255,.2)", textAlign: "center" }}>{mv.reps ?? "—"}</span>
                      <span style={{ fontSize: 20, fontWeight: 700, color: mv.duration ? "#fb923c" : "rgba(255,255,255,.2)", textAlign: "center" }}>{mv.duration ? `${mv.duration}s` : "—"}</span>
                      <span style={{ fontSize: 18, fontWeight: 600, color: mv.rest ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)", textAlign: "center" }}>{mv.rest ? `${mv.rest}s` : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [nav, setNav] = useState("athletes");
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const contentRef = useRef(null);
  const {athletes,loading:athletesLoading,reload:reloadAthletes}=useAthletes();

  // Auto-refresh athlete list every 60 seconds
  useEffect(()=>{
    const iv=setInterval(reloadAthletes,60000);
    return ()=>clearInterval(iv);
  },[]);

  const navItems = [
    {id:"athletes",label:"Athletes",icon:<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>},
    {id:"programs",label:"Programs",icon:<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>},
    {id:"analytics",label:"Analytics",icon:<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>},
    {id:"sessions",label:"Sessions",icon:<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans',system-ui,sans-serif", background: C.bg, WebkitFontSmoothing: "antialiased", overflow: "hidden" }}>
      <aside style={{ width: 232, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "22px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 4, marginBottom: 30 }}>
          <div style={{ width: 34, height: 34, background: C.lime, borderRadius: 9, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={2.5} strokeLinecap="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.ink }}>Durability</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", paddingLeft: 8, marginBottom: 6 }}>Coach</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => {
            const active = nav === item.id;
            return (
              <button key={item.id} onClick={() => { setNav(item.id); if (item.id === "athletes") { setView("list"); setSelected(null); } }}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, textAlign: "left", background: active ? C.limeXl : "transparent", color: active ? C.ink : C.sub, transition: "all .1s" }}>
                {item.icon}{item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", background: C.bg, borderRadius: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.lime, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>CD</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.ink }}>Coach Demo</div>
            <div style={{ fontSize: 11, color: C.muted }}>Head Coach</div>
          </div>
        </div>
      </aside>
      <main ref={contentRef} style={{ flex: 1, overflow: "auto", padding: 30 }}>
        {nav === "programs"  && <ProgramsTab savedWorkouts={savedWorkouts} setSavedWorkouts={setSavedWorkouts} />}
        {nav === "analytics" && <AnalyticsTab />}
        {nav === "sessions"  && <SessionsTab />}
        {nav === "athletes"  && (
          view === "list"
            ? <AthleteList athletes={athletes} loading={athletesLoading} onSelect={a => { setSelected(a); setView("detail"); if (contentRef.current) contentRef.current.scrollTop = 0; }} />
            : <AthleteDetail athlete={selected} onBack={() => { setSelected(null); setView("list"); }} />
        )}
      </main>
    </div>
  );
}
