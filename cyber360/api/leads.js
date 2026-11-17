const POINTS = [[15,8,0],[20,9,0],[15,7,0],[20,9,0],[10,5,0],[10,5,0],[10,5,0]];
const RECENT = new Map();
const clean = (value,max) => typeof value === "string" ? value.trim().slice(0,max) : "";
module.exports = async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method !== "POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Método não permitido."});}
 try{
  if(Number(req.headers["content-length"]||0)>12000)return res.status(413).json({error:"Dados excedem o limite permitido."});
  const ip=String(req.headers["x-forwarded-for"]||"").split(",")[0].slice(0,64)||"unknown";
  const now=Date.now(),past=(RECENT.get(ip)||[]).filter(t=>now-t<60000);
  if(past.length>=5)return res.status(429).json({error:"Muitas tentativas. Tente novamente em alguns minutos."});
  past.push(now);RECENT.set(ip,past);
  if(RECENT.size>500){for(const [k,v] of RECENT){if(v.every(t=>now-t>60000))RECENT.delete(k);}}
  const d=typeof req.body==="string"?JSON.parse(req.body):req.body;
  if(!d||typeof d!=="object"||Array.isArray(d))return res.status(400).json({error:"Dados inválidos."});
  if(d._company_website)return res.status(200).json({ok:true});
  if(!["cliente","novo"].includes(d.audience)||!Array.isArray(d.answers)||d.answers.length!==7||!d.answers.every(v=>Number.isInteger(v)&&v>=0&&v<=2))return res.status(400).json({error:"Conclua o diagnóstico antes de solicitar contato."});
  const score=d.answers.reduce((sum,a,i)=>sum+POINTS[i][a],0);
  if(d.score!==score)return res.status(400).json({error:"Pontuação inconsistente. Refaça o diagnóstico."});
  const name=clean(d.full_name,120),company=clean(d.company,160),email=clean(d.email,180).toLowerCase(),whatsapp=clean(d.whatsapp,32),cnpj=clean(d.cnpj,20),position=clean(d.position,100),size=clean(d.company_size,20);
  const phoneDigits=whatsapp.replace(/\D/g,"");
  if(name.length<2||company.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phoneDigits.length<10||phoneDigits.length>13)return res.status(400).json({error:"Confira os dados de contato."});
  if(size&&!["1-9","10-49","50-199","200+"].includes(size))return res.status(400).json({error:"Porte da empresa inválido."});
  if(d.consent_privacy!==true||d.consent_contact!==true)return res.status(400).json({error:"Confirme os consentimentos para receber atendimento."});
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return res.status(503).json({error:"Cadastro temporariamente indisponível. Entre em contato com atendimento@phoenixseg.com.br."});
  const record={
   audience:d.audience,full_name:name,company:company,email:email,whatsapp:whatsapp,
   cnpj:cnpj||null,position:position||null,company_size:size||null,score:score,
   preparedness:score>=75?"boa":score>=45?"parcial":"prioritaria",
   answers:{q1:d.answers[0],q2:d.answers[1],q3:d.answers[2],q4:d.answers[3],q5:d.answers[4],q6:d.answers[5],q7:d.answers[6]},
   wants_quote:d.wants_quote===true,consent_privacy:true,consent_contact:true,
   utm_source:clean(d.utm_source,100)||null,utm_medium:clean(d.utm_medium,100)||null,utm_campaign:clean(d.utm_campaign,120)||null,
   referrer:clean(req.headers.referer||"",500)||null,source:"phoenix-cyber-360"
  };
  const response=await fetch(url.replace(/\/$/,"")+"/rest/v1/phoenix_cyber360_leads",{
   method:"POST",headers:{"apikey":key,"Content-Type":"application/json","Prefer":"return=minimal"},
   body:JSON.stringify(record),signal:AbortSignal.timeout(8000)
  });
  if(!response.ok){console.error("Cyber360 lead insert",response.status);return res.status(503).json({error:"Não foi possível registrar agora. Tente novamente ou envie um e-mail."});}
  return res.status(201).json({ok:true});
 }catch(error){
  console.error("Cyber360 lead request",error&&error.message);
  return res.status(500).json({error:"Falha temporária no envio. Tente novamente."});
 }
};