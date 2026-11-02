const nav=document.getElementById("mainNav"),toggle=document.getElementById("menuToggle");
toggle.addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const configured=window.SUPABASE_URL?.startsWith("https://")&&window.SUPABASE_KEY?.startsWith("sb_publishable_");
const supabaseClient=configured?window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_KEY):null;
const dialog=document.getElementById("authDialog"),form=document.getElementById("authForm"),msg=document.getElementById("authMessage");
let mode="login";
function showMode(m){mode=m;document.getElementById("authTitle").textContent=m==="signup"?"Criar conta gratuita":m==="reset"?"Recuperar senha":"Entrar";document.getElementById("nameWrap").hidden=m!=="signup";document.getElementById("passwordWrap").hidden=m==="reset";document.getElementById("password").required=m!=="reset";document.getElementById("submitAuth").textContent=m==="signup"?"CRIAR CONTA":m==="reset"?"ENVIAR LINK":"ENTRAR";msg.textContent="";msg.className="";dialog.showModal();}
document.querySelectorAll("[data-auth]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();showMode(el.dataset.auth)}));
document.getElementById("closeAuth").onclick=()=>dialog.close();
document.getElementById("forgotPassword").onclick=()=>showMode("reset");
document.getElementById("switchAuth").onclick=()=>showMode(mode==="login"?"signup":"login");
form.addEventListener("submit",async e=>{e.preventDefault();if(!supabaseClient){msg.textContent="A conexão do Supabase ainda não está configurada. Confira config.js.";msg.className="error";return;}
const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
try{let result;if(mode==="signup")result=await supabaseClient.auth.signUp({email,password,options:{data:{full_name:document.getElementById("fullName").value.trim()}}});else if(mode==="login")result=await supabaseClient.auth.signInWithPassword({email,password});else result=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:location.origin});
if(result.error)throw result.error;msg.textContent=mode==="signup"?"Cadastro criado. Confira seu e-mail para confirmar a conta.":mode==="reset"?"Se o e-mail estiver cadastrado, você receberá um link de recuperação.":"Login realizado com sucesso.";if(mode==="login")setTimeout(()=>location.reload(),900);
}catch(err){msg.textContent=err.message||"Não foi possível concluir.";msg.className="error";}});
async function updateSession(){if(!supabaseClient)return;const {data:{session}}=await supabaseClient.auth.getSession();if(session){document.getElementById("sessionInfo").textContent="Conectado como "+session.user.email;document.getElementById("signOut").hidden=false;}}
document.getElementById("signOut").onclick=async()=>{if(supabaseClient){await supabaseClient.auth.signOut();location.reload();}};
updateSession();
