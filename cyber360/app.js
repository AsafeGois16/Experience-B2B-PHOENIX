(function(){
"use strict";
var questions=[
{q:"Sua empresa utiliza autenticação em duas etapas nos acessos importantes?",options:["Sim, na maioria dos acessos críticos","Em alguns acessos","Não / não sei"],points:[15,8,0],tip:"Ativar autenticação em duas etapas nos acessos essenciais."},
{q:"Os backups são realizados e testados regularmente?",options:["Sim, fazemos e testamos","Fazemos, mas testamos pouco","Não / não sei"],points:[20,9,0],tip:"Planejar backups seguros e testar periodicamente a recuperação."},
{q:"Os colaboradores recebem orientações para identificar golpes e e-mails falsos?",options:["Sim, periodicamente","Ocasionalmente","Não"],points:[15,7,0],tip:"Treinar a equipe sobre phishing e engenharia social."},
{q:"Sua empresa possui um plano de resposta e continuidade para incidentes digitais?",options:["Sim, documentado e conhecido","Está sendo desenvolvido","Não"],points:[20,9,0],tip:"Definir responsáveis e um plano de resposta e continuidade."},
{q:"A empresa revisa quem pode acessar os dados e sistemas?",options:["Sim, com revisões de acesso","Parcialmente","Não / não sei"],points:[10,5,0],tip:"Revisar permissões de acesso conforme as funções de cada pessoa."},
{q:"Os sistemas e equipamentos recebem atualizações de segurança?",options:["Sim, regularmente","Às vezes","Não / não sei"],points:[10,5,0],tip:"Estabelecer rotina de atualizações e correções de segurança."},
{q:"A equipe sabe quem acionar imediatamente em caso de incidente?",options:["Sim, há orientação clara","Algumas pessoas sabem","Não"],points:[10,5,0],tip:"Criar lista de contatos e orientações de resposta emergencial."}
];
var audience=null,step=0,answers=[null,null,null,null,null,null,null],score=0,submitted=false;
var el=function(id){return document.getElementById(id)},query=new URLSearchParams(location.search);
var origin=(query.get("origem")||query.get("publico")||"").toLowerCase();
function choose(type,scroll){
 audience=type;
 document.querySelectorAll("[data-audience]").forEach(function(btn){
  var active=btn.getAttribute("data-audience")===type;
  btn.classList.toggle("selected",active);btn.setAttribute("aria-pressed",active?"true":"false");
 });
 el("audienceLabel").textContent=type==="cliente"?"Jornada de cliente Phoenix":"Jornada de nova empresa";
 el("leadHeading").textContent=type==="cliente"?"Vamos complementar a proteção da sua empresa?":"Quer avaliar o Seguro Cyber para seu negócio?";
 el("leadDescription").textContent=type==="cliente"?"A Phoenix já acompanha sua empresa. Solicite uma conversa para avaliar proteções financeiras para riscos digitais.":"Nossa equipe pode conhecer sua empresa e orientar sobre as alternativas disponíveis no mercado.";
 render();if(scroll)el("diagnostico").scrollIntoView({behavior:"smooth"});
}
document.querySelectorAll("[data-audience]").forEach(function(btn){
 btn.addEventListener("click",function(){choose(btn.getAttribute("data-audience"),true)});
});
if(origin==="cliente"||origin==="carteira")choose("cliente",false);
else if(origin==="novo"||origin==="prospect")choose("novo",false);
function render(){
 el("quizView").classList.remove("hidden");el("resultView").classList.add("hidden");
 el("stepLabel").textContent=audience?"PERGUNTA "+(step+1)+" / 7":"7 PERGUNTAS";
 el("progressBar").style.width=(step/7*100)+"%";
 var container=el("options");container.replaceChildren();
 if(!audience){el("questionText").textContent="Escolha acima se já é cliente ou se deseja conhecer a Phoenix.";el("backBtn").disabled=true;el("nextBtn").disabled=true;return}
 var q=questions[step];el("questionText").textContent=q.q;
 q.options.forEach(function(option,i){
  var btn=document.createElement("button"),circle=document.createElement("i"),label=document.createElement("span");
  btn.className="choice"+(answers[step]===i?" selected":"");btn.type="button";btn.setAttribute("aria-pressed",answers[step]===i?"true":"false");
  circle.setAttribute("aria-hidden","true");label.textContent=option;btn.append(circle,label);
  btn.addEventListener("click",function(){answers[step]=i;render()});
  container.appendChild(btn);
 });
 el("backBtn").disabled=step===0;el("nextBtn").disabled=answers[step]===null;
 el("nextBtn").textContent=step===6?"Ver meu resultado →":"Próxima pergunta →";
}
el("backBtn").addEventListener("click",function(){if(step>0){step--;render()}});
el("nextBtn").addEventListener("click",function(){
 if(answers[step]===null)return;
 if(step<6){step++;render()}else showResult();
});
function levelFor(value){return value>=75?"boa":value>=45?"parcial":"prioritaria"}
function showResult(){
 score=questions.reduce(function(sum,q,i){return sum+q.points[answers[i]]},0);
 el("quizView").classList.add("hidden");el("resultView").classList.remove("hidden");el("stepLabel").textContent="CONCLUÍDO";
 el("scoreNumber").textContent=String(score);
 var level=levelFor(score);
 el("scoreLabel").textContent=level==="boa"?"Boa preparação inicial":level==="parcial"?"Preparação parcial":"Atenção prioritária";
 el("scoreSummary").textContent="Resultado indicativo com base apenas nas suas respostas.";
 el("interpretation").textContent=level==="boa"?"Você declarou práticas iniciais positivas. Continue revisando controles, acessos e planos periodicamente.":level==="parcial"?"Sua empresa declarou algumas práticas importantes, mas existem pontos que merecem melhorias.":"As respostas sugerem prioridades para estruturar controles básicos e um plano de resposta.";
 var tips=[];questions.forEach(function(q,i){if(answers[i]!==0)tips.push(q.tip)});
 if(!tips.length)tips=["Manter a revisão das medidas de segurança.","Testar periodicamente os procedimentos de resposta.","Reavaliar riscos e processos à medida que o negócio evolui."];
 el("tips").replaceChildren();tips.slice(0,4).forEach(function(t){var li=document.createElement("li");li.textContent=t;el("tips").appendChild(li)});
 el("resultView").scrollIntoView({behavior:"smooth",block:"start"});
}
el("restartBtn").addEventListener("click",function(){
 step=0;answers=[null,null,null,null,null,null,null];submitted=false;
 el("leadForm").reset();el("formStatus").textContent="";el("formStatus").className="";
 el("sendBtn").disabled=false;el("sendBtn").textContent="Solicitar análise com a Phoenix ↗";
 el("leadForm").querySelectorAll("input,select").forEach(function(input){input.disabled=false});
 render();el("diagnostico").scrollIntoView({behavior:"smooth"});
});
function makePdf(){
 var js=window.jspdf;if(!js||!js.jsPDF){window.print();return}
 var pdf=new js.jsPDF({unit:"mm",format:"a4"});
 pdf.setFillColor(7,25,43);pdf.rect(0,0,210,297,"F");
 pdf.setFillColor(20,53,78);pdf.roundedRect(12,13,186,46,4,4,"F");
 pdf.setTextColor(87,217,237);pdf.setFont("helvetica","bold");pdf.setFontSize(14);pdf.text("PHOENIX / CYBER 360",20,28);
 pdf.setTextColor(224,237,245);pdf.setFontSize(9);pdf.text("RELATORIO INDICATIVO DE PREPARACAO DIGITAL",20,41);
 pdf.setTextColor(248,252,255);pdf.setFontSize(13);pdf.text("Seu indice de preparacao",20,76);
 pdf.setTextColor(87,217,237);pdf.setFontSize(48);pdf.text(score+"/100",20,103);
 pdf.setFontSize(13);pdf.text(el("scoreLabel").textContent,20,117);
 pdf.setFont("helvetica","normal");pdf.setTextColor(204,223,235);pdf.setFontSize(10);
 pdf.text(pdf.splitTextToSize(el("interpretation").textContent,169),20,132);
 pdf.setDrawColor(80,115,137);pdf.line(20,151,190,151);
 pdf.setFont("helvetica","bold");pdf.setTextColor(241,249,255);pdf.setFontSize(13);pdf.text("Prioridades recomendadas",20,163);
 pdf.setFont("helvetica","normal");pdf.setFontSize(10);
 var y=177;Array.from(el("tips").children).forEach(function(li,i){var lines=pdf.splitTextToSize((i+1)+". "+li.textContent,163);pdf.text(lines,20,y);y+=lines.length*6+6});
 pdf.setDrawColor(80,115,137);pdf.line(20,256,190,256);pdf.setFontSize(8);pdf.setTextColor(171,191,205);
 pdf.text(pdf.splitTextToSize("Questionario educativo autodeclaratorio. Nao representa auditoria, teste de seguranca, certificacao ou garantia de cobertura. Seguro sujeito a analise, condicoes, limites e exclusoes.",165),20,265);
 pdf.setTextColor(87,217,237);pdf.text("Phoenix Insurance | atendimento@phoenixseg.com.br",20,289);
 pdf.save("Phoenix-Cyber-360-Diagnostico.pdf");
}
el("downloadBtn").addEventListener("click",makePdf);
function field(data,name){return String(data.get(name)||"").trim()}
el("leadForm").addEventListener("submit",async function(event){
 event.preventDefault();if(submitted)return;
 var form=el("leadForm"),fd=new FormData(form),status=el("formStatus"),btn=el("sendBtn");
 status.textContent="";status.className="";
 if(!form.checkValidity()){form.reportValidity();return}
 var phone=field(fd,"whatsapp").replace(/\D/g,"");
 if(phone.length<10||phone.length>13){status.className="bad";status.textContent="Confira o WhatsApp com DDD.";return}
 var payload={
  audience:audience,full_name:field(fd,"full_name"),company:field(fd,"company"),email:field(fd,"email"),whatsapp:field(fd,"whatsapp"),
  position:field(fd,"position"),company_size:field(fd,"company_size"),cnpj:field(fd,"cnpj"),
  answers:answers,score:score,wants_quote:fd.has("wants_quote"),
  consent_privacy:fd.has("consent_privacy"),consent_contact:fd.has("consent_contact"),
  _company_website:field(fd,"_company_website"),
  utm_source:query.get("utm_source")||"",utm_medium:query.get("utm_medium")||"",utm_campaign:query.get("utm_campaign")||""
 };
 btn.disabled=true;btn.textContent="Enviando solicitação...";
 try{
  var res=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  var json=await res.json().catch(function(){return{}});
  if(!res.ok)throw new Error(json.error||"Não foi possível registrar a solicitação.");
  submitted=true;status.className="good";status.textContent="Solicitação registrada! A equipe Phoenix poderá entrar em contato pelos canais autorizados.";
  btn.textContent="Solicitação enviada ✓";form.querySelectorAll("input,select").forEach(function(input){input.disabled=true});
 }catch(error){
  status.className="bad";status.textContent=error.message||"Falha no envio. Tente novamente.";btn.disabled=false;btn.textContent="Solicitar análise com a Phoenix ↗";
 }
});
render();
})();