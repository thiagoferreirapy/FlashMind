(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();function o(r,e=18,t="",s=""){const i=`width:${e}px;height:${e}px;${s?`color:${s}`:""}`;return`<i data-lucide="${r}" class="lucide-icon ${t}" style="${i}"></i>`}function m(){window.lucide&&window.lucide.createIcons()}const E=[{icon:"book-open",title:"Bem-vindo ao Fliply",text:"A plataforma de flashcards inteligentes que vai transformar seu aprendizado"},{icon:"brain",title:"Revisão Inteligente",text:"O Fliply aprende com você e mostra os cards certos na hora certa, sem desperdício de tempo"},{icon:"bar-chart-3",title:"Acompanhe sua Evolução",text:"Dashboard completo com estatísticas, ranking de dificuldade e insights do seu desempenho"},{icon:"smartphone",title:"Estude em Qualquer Lugar",text:"Receba desafios pelo WhatsApp e lembretes inteligentes para nunca parar de evoluir"}];class H{constructor(e){this.container=e,this.currentSlide=0}render(){this.container.innerHTML=`
      <div class="onboarding">
        <div class="onboarding-slides" id="ob-slides">
          ${E.map((e,t)=>`
            <div class="onboarding-slide">
              <div class="onboarding-illustration">${o(e.icon,80)}</div>
              <h1 class="onboarding-title">${e.title}</h1>
              <p class="onboarding-text">${e.text}</p>
            </div>
          `).join("")}
        </div>
        <div class="onboarding-footer">
          <div class="onboarding-dots" id="ob-dots">
            ${E.map((e,t)=>`<div class="onboarding-dot ${t===0?"active":""}"></div>`).join("")}
          </div>
          <button class="btn btn-primary btn-block btn-lg" id="ob-next">Próximo</button>
          <button class="btn btn-ghost btn-block" id="ob-skip">Pular</button>
        </div>
      </div>`,this._bindEvents(),m()}_bindEvents(){document.getElementById("ob-next").addEventListener("click",()=>{this.currentSlide<E.length-1?this._goTo(this.currentSlide+1):this._finish()}),document.getElementById("ob-skip").addEventListener("click",()=>this._finish());let e=0;const t=document.getElementById("ob-slides");t.addEventListener("touchstart",s=>{e=s.touches[0].clientX},{passive:!0}),t.addEventListener("touchend",s=>{const i=s.changedTouches[0].clientX-e;Math.abs(i)>50&&(i<0&&this.currentSlide<E.length-1?this._goTo(this.currentSlide+1):i>0&&this.currentSlide>0&&this._goTo(this.currentSlide-1))},{passive:!0})}_goTo(e){this.currentSlide=e,document.getElementById("ob-slides").scrollLeft=e*document.getElementById("ob-slides").offsetWidth,document.querySelectorAll(".onboarding-dot").forEach((t,s)=>t.classList.toggle("active",s===e)),document.getElementById("ob-next").textContent=e===E.length-1?"Começar":"Próximo"}_finish(){localStorage.setItem("fliply_visited","1"),window.router.navigate("/login")}destroy(){}}const j="/api";async function $(r,e,t){var c;const s=localStorage.getItem("fliply_token"),i={"Content-Type":"application/json"};s&&(i.Authorization=`Bearer ${s}`);const a=await fetch(`${j}${e}`,{method:r,headers:i,body:t?JSON.stringify(t):void 0});if(a.status===401)throw localStorage.removeItem("fliply_token"),localStorage.removeItem("fliply_user"),(c=window.router)==null||c.navigate("/login"),new Error("Sessão expirada. Faça login novamente.");const n=await a.text(),d=n?JSON.parse(n):{};if(!a.ok)throw new Error(d.message||`Erro ${a.status}`);return d}const v={get:r=>$("GET",r),post:(r,e)=>$("POST",r,e),put:(r,e)=>$("PUT",r,e),patch:(r,e)=>$("PATCH",r,e),delete:r=>$("DELETE",r)},L="fliply_token",I="fliply_user",f={isAuthenticated(){return!!localStorage.getItem(L)},getToken(){return localStorage.getItem(L)},getUser(){const r=localStorage.getItem(I);return r?JSON.parse(r):null},setSession(r,e){localStorage.setItem(L,r),localStorage.setItem(I,JSON.stringify(e))},clearSession(){localStorage.removeItem(L),localStorage.removeItem(I)},async login(r,e){const t=await v.post("/auth/login",{email:r,password:e});return this.setSession(t.token,t.user),t},async register(r,e,t){const s=await v.post("/auth/register",{name:r,email:e,password:t});return this.setSession(s.token,s.user),s},async forgotPassword(r){return v.post("/auth/forgot-password",{email:r})},async updateProfile(r){const e=await v.put("/users/me",r),t=this.getUser();return this.setSession(this.getToken(),{...t,...e}),e},logout(){this.clearSession(),window.router.navigate("/login")}};class R{constructor(e){this.container=e}render(){this.container.innerHTML=`
      <div class="auth-page">
        <div class="auth-logo">
          <div class="auth-logo-text">Fliply</div>
          <div class="auth-subtitle">Entre na sua conta</div>
        </div>

        <div class="auth-form">
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input id="auth-email" type="email" class="form-input" placeholder="seu@email.com" autocomplete="email">
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <input id="auth-password" type="password" class="form-input" placeholder="••••••••" autocomplete="current-password">
          </div>

          <div class="text-right mb-md">
            <a href="#/forgot-password" style="font-size:13px;color:var(--clr-primary-light)">Esqueci minha senha</a>
          </div>

          <button class="btn btn-primary btn-block btn-lg" id="btn-login">Entrar</button>

          <div class="divider-text">ou</div>

          <button class="btn btn-secondary btn-block" id="btn-google">
            ${o("chrome",18)} Continuar com Google
          </button>
        </div>

        <div class="auth-footer mt-lg">
          Não tem conta? <a href="#/register" style="color:var(--clr-primary-light);font-weight:700">Criar conta</a>
        </div>
      </div>
    `,this._bindEvents(),m()}_bindEvents(){document.getElementById("btn-login").addEventListener("click",()=>this._login()),document.getElementById("auth-password").addEventListener("keypress",e=>{e.key==="Enter"&&this._login()}),document.getElementById("btn-google").addEventListener("click",()=>{window.toast.info("Integração com Google em breve!")})}async _login(){const e=document.getElementById("auth-email").value.trim(),t=document.getElementById("auth-password").value;if(!e||!t){window.toast.error("Preencha todos os campos");return}const s=document.getElementById("btn-login");s.disabled=!0,s.textContent="Entrando...";try{await f.login(e,t),window.router.navigate("/home")}catch(i){window.toast.error(i.message||"Erro ao fazer login")}finally{s.disabled=!1,s.textContent="Entrar"}}destroy(){}}class O{constructor(e){this.container=e}render(){this.container.innerHTML=`
      <div class="auth-page">
        <div class="auth-logo">
          <div class="auth-logo-text">Fliply</div>
          <div class="auth-subtitle">Crie sua conta grátis</div>
        </div>

        <div class="auth-form">
          <div class="form-group">
            <label class="form-label">Nome completo</label>
            <input id="reg-name" type="text" class="form-input" placeholder="Seu nome" autocomplete="name">
          </div>

          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input id="reg-email" type="email" class="form-input" placeholder="seu@email.com" autocomplete="email">
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <input id="reg-password" type="password" class="form-input" placeholder="Mínimo 8 caracteres" autocomplete="new-password">
          </div>

          <div class="form-group">
            <label class="form-label">Confirmar senha</label>
            <input id="reg-password2" type="password" class="form-input" placeholder="Repita a senha" autocomplete="new-password">
          </div>

          <button class="btn btn-primary btn-block btn-lg mt-md" id="btn-register">Criar conta</button>
        </div>

        <div class="auth-footer mt-lg">
          Já tem conta? <a href="#/login" style="color:var(--clr-primary-light);font-weight:700">Entrar</a>
        </div>
      </div>
    `,document.getElementById("btn-register").addEventListener("click",()=>this._register())}async _register(){const e=document.getElementById("reg-name").value.trim(),t=document.getElementById("reg-email").value.trim(),s=document.getElementById("reg-password").value,i=document.getElementById("reg-password2").value;if(!e||!t||!s){window.toast.error("Preencha todos os campos");return}if(s.length<8){window.toast.error("Senha deve ter pelo menos 8 caracteres");return}if(s!==i){window.toast.error("As senhas não conferem");return}const a=document.getElementById("btn-register");a.disabled=!0,a.textContent="Criando conta...";try{await f.register(e,t,s),window.toast.success("Conta criada! Bem-vindo ao Fliply!"),window.router.navigate("/home")}catch(n){window.toast.error(n.message||"Erro ao criar conta")}finally{a.disabled=!1,a.textContent="Criar conta"}}destroy(){}}class b{constructor(e){this.id=e.id,this.user_id=e.userId,this.name=e.name,this.description=e.description||"",this.icon=e.icon||"📚",this.color=e.color||"#7C3AED",this.is_public=e.isPublic??!1,this.allow_clone=e.allowClone??!0,this.card_count=e.cardCount??0,this.due_count=e.dueCount??0,this.created_at=e.createdAt,this.updated_at=e.updatedAt}static async fetchAll(){return(await v.get("/decks")).map(t=>new b(t))}static async fetchById(e){const t=await v.get(`/decks/${e}`);return new b(t)}static async create(e){const t=await v.post("/decks",e);return new b(t)}async update(e){const t=await v.put(`/decks/${this.id}`,e);return new b(t)}async delete(){return v.delete(`/decks/${this.id}`)}async share(){return v.post(`/decks/${this.id}/share`,{})}}function F(r){if(!r)return"";const e=new Date(r),s=Math.floor((new Date-e)/1e3);return s<60?"agora mesmo":s<3600?`${Math.floor(s/60)} min atrás`:s<86400?`${Math.floor(s/3600)}h atrás`:`${Math.floor(s/86400)}d atrás`}function z(r){return r?r.split(" ").slice(0,2).map(e=>e[0]).join("").toUpperCase():"?"}function k(r,e){return e?Math.round(r/e*100):0}const T=["#7C3AED","#2563EB","#0891B2","#059669","#D97706","#DC2626","#DB2777","#7C3AED"],M=["book-open","brain","globe","microscope","monitor","guitar","pencil","dumbbell","ruler","languages","palette","lightbulb"];function _(r,e=24){return r?/^[a-z][a-z0-9-]*$/.test(r)?`<i data-lucide="${r}" style="width:${e}px;height:${e}px"></i>`:`<span style="font-size:${e}px;line-height:1">${r}</span>`:""}class Y{constructor(e){this.container=e,this.decks=[],this.stats={}}async render(){this.container.innerHTML=this._skeleton();try{const[e,t]=await Promise.all([b.fetchAll(),v.get("/dashboard/summary")]);this.decks=e,this.stats=t,this.container.innerHTML=this._template(),this._bindEvents()}catch{this.container.innerHTML=this._template(),this._bindEvents()}m()}_template(){var d;const e=f.getUser(),t=new Date().getHours(),s=t<12?"Bom dia":t<18?"Boa tarde":"Boa noite",i=this.stats.streak??0,a=this.stats.studiedToday??0,n=this.stats.dailyGoal??20;return`
      <div class="animate-fade">
        <div class="page-header">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.08em">Fliply</div>
            <div style="font-size:17px;font-weight:700">${s}, ${((d=e==null?void 0:e.name)==null?void 0:d.split(" ")[0])||"Estudante"} !</div>
          </div>
          <div class="avatar avatar-sm" id="home-avatar" style="cursor:pointer">${z(e==null?void 0:e.name)}</div>
        </div>

        <div style="padding:var(--space-md)">
          ${i>0?`
          <div class="streak-banner mb-md">
            <div class="streak-icon">${o("flame",32)}</div>
            <div>
              <div class="streak-count">${i} dias</div>
              <div class="streak-label">de sequência de estudos</div>
            </div>
          </div>
          `:""}

          <!-- Meta diária -->
          <div class="card mb-md">
            <div class="flex items-center justify-between mb-md">
              <span style="font-weight:700">Meta de hoje</span>
              <span style="font-size:13px;color:var(--text-secondary)">${a} / ${n} cards</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width:${k(a,n)}%"></div>
            </div>
            ${a>=n?`<div style="font-size:12px;color:var(--clr-success);margin-top:8px;font-weight:700">${o("trophy",14)} Meta atingida!</div>`:""}
          </div>

          <!-- Stats rápidos -->
          <div class="stats-grid mb-md">
            <div class="stat-card">
              <div class="stat-icon">${o("library",22)}</div>
              <div class="stat-value">${this.decks.length}</div>
              <div class="stat-label">Decks</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">${o("target",22)}</div>
              <div class="stat-value">${this.stats.totalStudied??0}</div>
              <div class="stat-label">Cards estudados</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">${o("check-circle",22)}</div>
              <div class="stat-value">${this.stats.accuracy??0}%</div>
              <div class="stat-label">Taxa de acerto</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">${o("clock",22)}</div>
              <div class="stat-value">${this.stats.dueCount??0}</div>
              <div class="stat-label">Para revisar</div>
            </div>
          </div>

          <!-- Decks recentes -->
          <div class="section-header">
            <div class="section-title">Seus Decks</div>
            <div class="section-link" id="view-all-decks">Ver todos</div>
          </div>

          ${this.decks.length===0?`
            <div class="empty-state" style="padding:var(--space-xl) 0">
              <div class="empty-state-icon">${o("inbox",56)}</div>
              <div class="empty-state-title">Nenhum deck ainda</div>
              <div class="empty-state-text">Crie seu primeiro deck e comece a estudar!</div>
              <button class="btn btn-primary" id="create-first-deck">+ Criar deck</button>
            </div>
          `:this.decks.slice(0,3).map(c=>`
            <div class="deck-card" data-id="${c.id}">
              <div class="deck-card-icon" style="background:${c.color}22">${_(c.icon,24)}</div>
              <div class="deck-card-info">
                <div class="deck-card-name">${c.name}</div>
                <div class="deck-card-meta">${c.card_count} cards${c.due_count>0?` · <span style="color:var(--clr-warning)">${c.due_count} para revisar</span>`:""}</div>
              </div>
              <div class="deck-card-arrow">›</div>
            </div>
          `).join("")}

          ${this.decks.length>0?`
          <div style="margin-top:var(--space-sm)">
            <button class="btn btn-secondary btn-block" id="study-now-btn">${o("zap",16)} Estudar agora</button>
          </div>
          `:""}
        </div>
      </div>
    `}_skeleton(){return`
      <div style="padding:var(--space-md)">
        ${[1,2,3].map(()=>`
          <div style="height:64px;background:var(--bg-card);border-radius:var(--radius-lg);margin-bottom:var(--space-sm);animation:pulse 1.5s infinite"></div>
        `).join("")}
      </div>
    `}_bindEvents(){var e,t,s,i;(e=this.container.querySelector("#view-all-decks"))==null||e.addEventListener("click",()=>window.router.navigate("/decks")),(t=this.container.querySelector("#create-first-deck"))==null||t.addEventListener("click",()=>window.router.navigate("/decks")),(s=this.container.querySelector("#study-now-btn"))==null||s.addEventListener("click",()=>{this.decks.length>0&&window.router.navigate(`/study/${this.decks[0].id}`)}),(i=this.container.querySelector("#home-avatar"))==null||i.addEventListener("click",()=>window.router.navigate("/settings")),this.container.querySelectorAll(".deck-card").forEach(a=>{a.addEventListener("click",()=>window.router.navigate(`/deck/${a.dataset.id}`))})}destroy(){}}class p{constructor({title:e,content:t,onClose:s}){this.title=e,this.content=t,this.onClose=s,this.el=null}open(){const e=document.getElementById("modal-container");e.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-content animate-slide-up" id="modal-content">
          <div class="modal-handle" id="modal-handle"></div>
          ${this.title?`<div class="modal-title">${this.title}</div>`:""}
          ${this.content}
        </div>
      </div>
    `,this.el=e.querySelector("#modal-overlay");const t=e.querySelector("#modal-content"),s=e.querySelector("#modal-handle");document.body.classList.add("no-scroll"),this.el.addEventListener("click",h=>{h.target===this.el&&this.close()});let i=0,a=0,n=!1;const d=h=>{i=h.touches?h.touches[0].clientY:h.clientY,n=!0,t.style.transition="none"},c=h=>{if(!n)return;a=h.touches?h.touches[0].clientY:h.clientY;const g=Math.max(0,a-i);if(g>0){const y=Math.max(0,1-g/400);t.style.transform=`translateY(${g}px)`,this.el.style.backgroundColor=`rgba(0, 0, 0, ${.75*y})`}},l=()=>{if(!n)return;n=!1,a-i>150?this.close():(t.style.transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",t.style.transform="translateY(0)",this.el.style.transition="background-color 0.3s ease",this.el.style.backgroundColor="var(--bg-overlay)",setTimeout(()=>{t.style.transition="",this.el.style.transition=""},300))};s.addEventListener("touchstart",d,{passive:!0}),s.addEventListener("touchmove",c,{passive:!0}),s.addEventListener("touchend",l);const u=e.querySelector(".modal-title");return u&&(u.addEventListener("touchstart",d,{passive:!0}),u.addEventListener("touchmove",c,{passive:!0}),u.addEventListener("touchend",l)),this}close(){const e=document.getElementById("modal-container"),t=e.querySelector(".modal-content"),s=e.querySelector(".modal-overlay");t&&s?(t.classList.remove("animate-slide-up"),t.style.transition="transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",s.style.transition="opacity 0.3s ease",requestAnimationFrame(()=>{t.style.transform="translateY(100%)",t.style.opacity="0",s.style.opacity="0"}),setTimeout(()=>{e.innerHTML="",e.querySelector(".modal-overlay")||document.body.classList.remove("no-scroll"),this.onClose&&this.onClose()},350)):(e.innerHTML="",document.body.classList.remove("no-scroll"),this.onClose&&this.onClose())}static confirm({title:e,message:t,confirmText:s="Confirmar",onConfirm:i,danger:a=!1}){const n=new p({title:e,content:`
        <div style="padding-bottom: 24px">
          <p style="color: var(--text-secondary); font-size: 15px; line-height: 1.5">${t}</p>
        </div>
        <div class="flex gap-sm">
          <button class="btn btn-secondary flex-1" id="modal-cancel">Cancelar</button>
          <button class="btn ${a?"btn-danger":"btn-primary"} flex-1" id="modal-confirm">${s}</button>
        </div>
      `});return n.open(),document.getElementById("modal-cancel").addEventListener("click",()=>n.close()),document.getElementById("modal-confirm").addEventListener("click",()=>{i&&i(),n.close()}),n}}class U{constructor(e){this.container=e,this.decks=[],this.search=""}async render(){this.container.innerHTML=this._skeleton();try{this.decks=await b.fetchAll()}catch{this.decks=[]}this.container.innerHTML=this._template(),this._bindEvents(),m()}_template(){const e=this.decks.filter(t=>t.name.toLowerCase().includes(this.search.toLowerCase()));return`
      <div class="animate-fade">
        <div class="page-header">
          <h1>Meus Decks</h1>
          <button class="icon-btn" id="btn-new-deck" title="Novo deck">＋</button>
        </div>
        <div style="padding:var(--space-md) var(--space-md) var(--space-sm)">
          <input type="search" class="form-input" id="deck-search" placeholder="Buscar decks..." value="${this.search}">
        </div>
        <div style="padding:0 var(--space-md) var(--space-md)">
          ${e.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">${o("inbox",56)}</div>
              <div class="empty-state-title">${this.search?"Nenhum resultado":"Nenhum deck ainda"}</div>
              <div class="empty-state-text">${this.search?"Tente outro termo de busca":"Crie seu primeiro deck para começar a estudar!"}</div>
              ${this.search?"":'<button class="btn btn-primary mt-md" id="btn-empty-new">+ Criar meu primeiro deck</button>'}
            </div>
          `:e.map(t=>this._deckItem(t)).join("")}
        </div>
      </div>
      <button class="fab" id="fab-new-deck">＋</button>`}_deckItem(e){return`<div class="deck-card" data-id="${e.id}" data-action="open">
      <div class="deck-card-icon" style="background:${e.color}25">${_(e.icon,24)}</div>
      <div class="deck-card-info">
        <div class="deck-card-name">${e.name}</div>
        <div class="deck-card-meta">${e.card_count} cards${e.due_count>0?` · <span style="color:var(--clr-warning)">${o("clock",12)} ${e.due_count} p/ revisar</span>`:""}</div>
      </div>
      <button class="icon-btn" data-id="${e.id}" data-action="menu" style="background:transparent;border:none">⋮</button>
    </div>`}_skeleton(){return`<div style="padding:var(--space-md)">${[1,2,3,4].map(()=>'<div style="height:72px;background:var(--bg-card);border-radius:var(--radius-lg);margin-bottom:8px;animation:pulse 1.5s infinite"></div>').join("")}</div>`}_bindEvents(){var t,s,i,a;const e=()=>this._openDeckModal();(t=this.container.querySelector("#btn-new-deck"))==null||t.addEventListener("click",e),(s=this.container.querySelector("#fab-new-deck"))==null||s.addEventListener("click",e),(i=this.container.querySelector("#btn-empty-new"))==null||i.addEventListener("click",e),(a=this.container.querySelector("#deck-search"))==null||a.addEventListener("input",n=>{var l;this.search=n.target.value;const d=this.decks.filter(u=>u.name.toLowerCase().includes(this.search.toLowerCase())),c=this.container.querySelector("[data-deck-list]")||((l=this.container.querySelector(".deck-card"))==null?void 0:l.parentElement);c&&(c.innerHTML=this._renderList(d)),this._bindDeckEvents(),m()}),this._bindDeckEvents()}_bindDeckEvents(){this.container.querySelectorAll(".deck-card").forEach(e=>{e.addEventListener("click",t=>{const s=t.target.closest('[data-action="menu"]');s?this._openDeckMenu(s.dataset.id):window.router.navigate(`/deck/${e.dataset.id}`)})})}_renderList(e){return e.length===0?`<div class="empty-state"><div class="empty-state-icon">${o("search",56)}</div><div class="empty-state-title">Nenhum resultado</div></div>`:e.map(t=>this._deckItem(t)).join("")}_openDeckModal(e){const t=!!e;let s=(e==null?void 0:e.color)||T[0],i=(e==null?void 0:e.icon)||M[0];const a=new p({title:t?"Editar deck":"Novo deck",content:`
        <div class="form-group"><label class="form-label">Nome</label>
          <input id="deck-name" type="text" class="form-input" placeholder="Ex.: Inglês Básico" value="${(e==null?void 0:e.name)||""}"></div>
        <div class="form-group"><label class="form-label">Descrição (opcional)</label>
          <input id="deck-desc" type="text" class="form-input" placeholder="Uma breve descrição" value="${(e==null?void 0:e.description)||""}"></div>
        <div class="form-group"><label class="form-label">Ícone</label>
          <div class="flex gap-sm" style="flex-wrap:wrap" id="icon-picker">
            ${M.map(n=>`<button class="btn btn-sm btn-secondary icon-opt ${n===i?"btn-primary":""}" data-icon="${n}" style="min-width:48px;min-height:48px">${_(n,22)}</button>`).join("")}
          </div></div>
        <div class="form-group"><label class="form-label">Cor</label>
          <div class="color-picker" id="color-picker">
            ${T.map(n=>`<div class="color-option ${n===s?"selected":""}" data-color="${n}" style="background:${n}"></div>`).join("")}
          </div></div>
        <div class="flex gap-sm mt-md">
          <button class="btn btn-secondary flex-1" id="deck-cancel">Cancelar</button>
          <button class="btn btn-primary flex-1" id="deck-save">${t?"Salvar":"Criar"}</button></div>`});a.open(),m(),document.getElementById("icon-picker").addEventListener("click",n=>{const d=n.target.closest(".icon-opt");d&&(i=d.dataset.icon,document.querySelectorAll(".icon-opt").forEach(c=>{c.classList.toggle("btn-primary",c.dataset.icon===i),c.classList.toggle("btn-secondary",c.dataset.icon!==i)}))}),document.getElementById("color-picker").addEventListener("click",n=>{const d=n.target.closest(".color-option");d&&(s=d.dataset.color,document.querySelectorAll(".color-option").forEach(c=>c.classList.toggle("selected",c.dataset.color===s)))}),document.getElementById("deck-cancel").addEventListener("click",()=>a.close()),document.getElementById("deck-save").addEventListener("click",async()=>{const n=document.getElementById("deck-name").value.trim();if(!n){window.toast.error("Nome é obrigatório");return}const d=document.getElementById("deck-save");d.disabled=!0,d.textContent="Salvando...";const c={name:n,description:document.getElementById("deck-desc").value.trim(),icon:i,color:s};try{if(t){const l=await e.update(c),u=this.decks.findIndex(h=>h.id===e.id);u>=0&&(this.decks[u]=l)}else{const l=await b.create(c);this.decks.unshift(l)}a.close(),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success(t?"Deck atualizado!":"Deck criado!")}catch(l){window.toast.error(l.message),d.disabled=!1,d.textContent=t?"Salvar":"Criar"}})}_openDeckMenu(e){const t=this.decks.find(i=>i.id==e);if(!t)return;const s=new p({title:t.name,content:`<div class="flex flex-col gap-sm">
        <button class="btn btn-secondary btn-block" id="dm-study">${o("zap",16)} Estudar</button>
        <button class="btn btn-secondary btn-block" id="dm-edit">${o("pencil",16)} Editar</button>
        <button class="btn btn-secondary btn-block" id="dm-share">${o("link",16)} Compartilhar</button>
        <button class="btn btn-danger btn-block" id="dm-delete">${o("trash-2",16)} Excluir</button></div>`});s.open(),m(),document.getElementById("dm-study").addEventListener("click",()=>{s.close(),window.router.navigate(`/study/${t.id}`)}),document.getElementById("dm-edit").addEventListener("click",()=>{s.close(),this._openDeckModal(t)}),document.getElementById("dm-share").addEventListener("click",async()=>{try{const i=await t.share();s.close(),window.toast.success(`Código: ${i.shareCode}`)}catch(i){window.toast.error(i.message)}}),document.getElementById("dm-delete").addEventListener("click",()=>{s.close(),p.confirm({title:"Excluir deck",message:`Tem certeza que deseja excluir "${t.name}"? Todos os cards e progresso serão perdidos.`,confirmText:"Excluir",danger:!0,onConfirm:async()=>{try{await t.delete(),this.decks=this.decks.filter(i=>i.id!==t.id),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success("Deck excluído")}catch(i){window.toast.error(i.message)}}})})}destroy(){}}class w{constructor(e){this.id=e.id,this.deck_id=e.deckId,this.front_text=e.frontText,this.back_text=e.backText,this.position=e.position??0,this.created_at=e.createdAt,this.updated_at=e.updatedAt}static async fetchByDeck(e){return(await v.get(`/decks/${e}/cards`)).map(s=>new w(s))}static async create(e,t){const s=await v.post(`/decks/${e}/cards`,t);return new w(s)}async update(e){const t=await v.put(`/cards/${this.id}`,e);return new w(t)}async delete(){return v.delete(`/cards/${this.id}`)}}class W{constructor(e,t){this.container=e,this.deckId=t.id,this.deck=null,this.cards=[]}async render(){this.container.innerHTML=this._skeleton();try{const[e,t]=await Promise.all([b.fetchById(this.deckId),w.fetchByDeck(this.deckId)]);this.deck=e,this.cards=t}catch{window.toast.error("Erro ao carregar deck")}this.container.innerHTML=this._template(),this._bindEvents(),m()}_template(){const e=this.deck;return e?`
      <div class="animate-fade">
        <div class="page-header">
          <button class="icon-btn" id="btn-back">${o("arrow-left",18)}</button>
          <h1 style="font-size:17px" class="truncate">${_(e.icon,20)} ${e.name}</h1>
          <button class="icon-btn" id="btn-deck-menu">⋮</button>
        </div>
        <div style="padding:var(--space-md)">
          <div style="background:${e.color}20;border:1px solid ${e.color}40;border-radius:var(--radius-xl);padding:var(--space-lg);margin-bottom:var(--space-md)">
            <div style="font-size:48px;margin-bottom:var(--space-sm)">${_(e.icon,48)}</div>
            <div style="font-size:20px;font-weight:800">${e.name}</div>
            ${e.description?`<div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${e.description}</div>`:""}
            <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md)">
              <div style="text-align:center"><div style="font-size:20px;font-weight:800">${this.cards.length}</div><div style="font-size:11px;color:var(--text-secondary)">Cards</div></div>
              <div style="text-align:center"><div style="font-size:20px;font-weight:800;color:var(--clr-warning)">${e.due_count??0}</div><div style="font-size:11px;color:var(--text-secondary)">Revisão</div></div>
            </div>
          </div>
          <div class="flex gap-sm mb-md">
            <button class="btn btn-primary flex-1" id="btn-study" ${this.cards.length===0?"disabled":""}>${o("zap",16)} Estudar</button>
            <button class="btn btn-secondary" id="btn-add-card">＋ Card</button>
          </div>
          <div class="section-header"><div class="section-title">Cards (${this.cards.length})</div></div>
          ${this.cards.length===0?`
            <div class="empty-state"><div class="empty-state-icon">${o("layers",56)}</div>
              <div class="empty-state-title">Nenhum card</div>
              <div class="empty-state-text">Adicione cards para começar a estudar</div></div>
          `:this.cards.map((t,s)=>`
            <div class="card mb-sm" style="cursor:default">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-sm)">
                <div style="flex:1">
                  <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Frente</div>
                  <div style="font-weight:600">${t.front_text}</div>
                  <div style="height:1px;background:var(--border-color);margin:10px 0"></div>
                  <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Verso</div>
                  <div style="color:var(--text-secondary)">${t.back_text}</div>
                </div>
                <div class="flex gap-xs" style="flex-shrink:0">
                  <button class="icon-btn btn-edit-card" data-card-id="${t.id}" data-idx="${s}" style="font-size:13px;width:32px;height:32px">${o("pencil",14)}</button>
                  <button class="icon-btn btn-delete-card" data-card-id="${t.id}" style="font-size:13px;width:32px;height:32px">${o("trash-2",14)}</button>
                </div>
              </div>
            </div>`).join("")}
        </div>
      </div>`:'<div class="empty-state"><div class="empty-state-title">Deck não encontrado</div></div>'}_skeleton(){return`<div style="padding:var(--space-md)">${[1,2,3].map(()=>'<div style="height:80px;background:var(--bg-card);border-radius:var(--radius-lg);margin-bottom:8px;animation:pulse 1.5s infinite"></div>').join("")}</div>`}_bindEvents(){var e,t,s,i;(e=this.container.querySelector("#btn-back"))==null||e.addEventListener("click",()=>window.router.navigate("/decks")),(t=this.container.querySelector("#btn-study"))==null||t.addEventListener("click",()=>window.router.navigate(`/study/${this.deckId}`)),(s=this.container.querySelector("#btn-add-card"))==null||s.addEventListener("click",()=>this._openCardModal()),(i=this.container.querySelector("#btn-deck-menu"))==null||i.addEventListener("click",()=>this._deckMenu()),this.container.querySelectorAll(".btn-edit-card").forEach(a=>{a.addEventListener("click",()=>{const n=this.cards[parseInt(a.dataset.idx)];this._openCardModal(n)})}),this.container.querySelectorAll(".btn-delete-card").forEach(a=>{a.addEventListener("click",()=>{const n=this.cards.find(d=>d.id==a.dataset.cardId);p.confirm({title:"Excluir card",message:"Tem certeza que deseja excluir este card?",confirmText:"Excluir",danger:!0,onConfirm:async()=>{try{await n.delete(),this.cards=this.cards.filter(d=>d.id!==n.id),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success("Card excluído")}catch(d){window.toast.error(d.message)}}})})})}_openCardModal(e){const t=!!e,s=new p({title:t?"Editar card":"Novo card",content:`
        <div class="form-group"><label class="form-label">Frente (pergunta)</label>
          <textarea id="card-front" class="form-input" placeholder="Digite a pergunta ou termo" rows="3">${(e==null?void 0:e.front_text)||""}</textarea></div>
        <div class="form-group"><label class="form-label">Verso (resposta)</label>
          <textarea id="card-back" class="form-input" placeholder="Digite a resposta ou definição" rows="3">${(e==null?void 0:e.back_text)||""}</textarea></div>
        <div class="flex gap-sm mt-md">
          <button class="btn btn-secondary flex-1" id="card-cancel">Cancelar</button>
          <button class="btn btn-primary flex-1" id="card-save">${t?"Salvar":"Adicionar"}</button></div>`});s.open(),document.getElementById("card-cancel").addEventListener("click",()=>s.close()),document.getElementById("card-save").addEventListener("click",async()=>{const i=document.getElementById("card-front").value.trim(),a=document.getElementById("card-back").value.trim();if(!i||!a){window.toast.error("Preencha frente e verso");return}const n=document.getElementById("card-save");n.disabled=!0,n.textContent="Salvando...";try{if(t){const d=await e.update({frontText:i,backText:a}),c=this.cards.findIndex(l=>l.id===e.id);c>=0&&(this.cards[c]=d)}else{const d=await w.create(this.deckId,{frontText:i,backText:a});this.cards.push(d)}s.close(),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success(t?"Card atualizado!":"Card adicionado!")}catch(d){window.toast.error(d.message),n.disabled=!1,n.textContent=t?"Salvar":"Adicionar"}})}_deckMenu(){const e=this.deck,t=new p({title:"Opções do deck",content:`<div class="flex flex-col gap-sm">
        <button class="btn btn-secondary btn-block" id="dm-share">${o("link",16)} Compartilhar deck</button>
        <button class="btn btn-danger btn-block" id="dm-delete">${o("trash-2",16)} Excluir deck</button></div>`});t.open(),m(),document.getElementById("dm-share").addEventListener("click",async()=>{var s;try{const i=await e.share();t.close(),new p({title:"Compartilhar deck",content:`
          <p style="color:var(--text-secondary);margin-bottom:var(--space-md)">Compartilhe este código com outros usuários:</p>
          <div style="background:var(--bg-input);border-radius:var(--radius-md);padding:var(--space-md);text-align:center;font-size:24px;font-weight:800;letter-spacing:0.1em;color:var(--clr-primary-light)">${i.shareCode}</div>
          <button class="btn btn-primary btn-block mt-md" id="copy-code">${o("clipboard",16)} Copiar código</button>`}).open(),m(),(s=document.getElementById("copy-code"))==null||s.addEventListener("click",()=>{var a;(a=navigator.clipboard)==null||a.writeText(i.shareCode),window.toast.success("Código copiado!")})}catch(i){window.toast.error(i.message)}}),document.getElementById("dm-delete").addEventListener("click",()=>{t.close(),p.confirm({title:"Excluir deck",message:`Excluir "${e.name}" e todos os seus cards?`,confirmText:"Excluir",danger:!0,onConfirm:async()=>{try{await e.delete(),window.router.navigate("/decks"),window.toast.success("Deck excluído")}catch(s){window.toast.error(s.message)}}})})}destroy(){}}class C{constructor(e){this.id=e.id,this.user_id=e.userId,this.card_id=e.cardId,this.right_count=e.rightCount??0,this.wrong_count=e.wrongCount??0,this.unsure_count=e.unsureCount??0,this.streak=e.streak??0,this.difficulty_score=e.difficultyScore??1,this.review_after=e.reviewAfter,this.last_review_at=e.lastReviewAt,this.total_reviews=e.totalReviews??0,this.status=e.status??"new"}static async fetchByDeck(e){return(await v.get(`/decks/${e}/progress`)).map(s=>new C(s))}static async recordAnswer(e,t,s){return v.post(`/sessions/${e}/answers`,{cardId:t,answerType:s})}}class x{constructor(e){this.id=e.id,this.deck_id=e.deckId,this.total_cards=e.totalCards??0,this.right_count=e.rightCount??0,this.wrong_count=e.wrongCount??0,this.unsure_count=e.unsureCount??0,this.started_at=e.startedAt,this.finished_at=e.finishedAt}static async start(e){const t=await v.post("/sessions",{deckId:e});return new x(t)}async finish(e){const t=await v.put(`/sessions/${this.id}/finish`,e);return new x(t)}static async fetchRecent(e=10){return(await v.get(`/sessions?limit=${e}`)).map(s=>new x(s))}}class V{constructor(e,{front:t,back:s,onFlip:i}){this.container=e,this.front=t,this.back=s,this.onFlip=i,this.flipped=!1}render(){this.container.innerHTML=`
      <div class="flip-card-container" id="flip-card">
        <div class="flip-card-inner" id="flip-card-inner">
          <div class="flip-card-face flip-card-front">
            <div class="flip-card-label">Pergunta</div>
            <div class="flip-card-text">${this.front}</div>
            <div class="flip-card-hint">${o("pointer",14)} Toque para revelar</div>
          </div>
          <div class="flip-card-face flip-card-back">
            <div class="flip-card-label">Resposta</div>
            <div class="flip-card-text">${this.back}</div>
          </div>
        </div>
      </div>
    `,document.getElementById("flip-card").addEventListener("click",()=>this.flip())}flip(){this.flipped=!this.flipped,document.getElementById("flip-card-inner").classList.toggle("flipped",this.flipped),this.onFlip&&this.onFlip(this.flipped)}reset(){this.flipped=!1;const e=document.getElementById("flip-card-inner");e&&e.classList.remove("flipped")}}function G(r){return r?new Date(r)<=new Date:!0}class K{constructor(e,t){this.container=e,this.deckId=t.deckId,this.deck=null,this.cards=[],this.session=null,this.current=0,this.revealed=!1,this.stats={right:0,wrong:0,unsure:0},this.flipCard=null}async render(){var e;this.container.innerHTML='<div class="flex items-center justify-center" style="height:100vh"><div class="spinner"></div></div>';try{const[t,s,i]=await Promise.all([b.fetchById(this.deckId),w.fetchByDeck(this.deckId),C.fetchByDeck(this.deckId)]);this.deck=t;const a={};i.forEach(u=>a[u.card_id]=u);const n=JSON.parse(localStorage.getItem("fliply_user")||"{}"),d=n.session_size??10,c=n.smart_order!==!1;let l=s.filter(u=>!a[u.id]||G(a[u.id].review_after));if(l.length===0&&(l=s),c)l.sort((u,h)=>{var g,y;return(((g=a[h.id])==null?void 0:g.difficulty_score)??1)-(((y=a[u.id])==null?void 0:y.difficulty_score)??1)});else for(let u=l.length-1;u>0;u--){const h=Math.floor(Math.random()*(u+1));[l[u],l[h]]=[l[h],l[u]]}this.cards=l.slice(0,d),this.session=await x.start(this.deckId)}catch{this.container.innerHTML=`<div class="empty-state"><div class="empty-state-title">Erro ao iniciar estudo</div><button class="btn btn-primary mt-md" id="back-btn">${o("arrow-left",14)} Voltar</button></div>`,m(),(e=this.container.querySelector("#back-btn"))==null||e.addEventListener("click",()=>window.router.back());return}if(this.cards.length===0){this._renderEmpty();return}this._renderCard()}_renderCard(){var s,i;const e=this.cards[this.current],t=Math.round(this.current/this.cards.length*100);this.container.innerHTML=`
      <div class="study-page animate-fade">
        <div class="study-header">
          <button class="icon-btn" id="study-back">${o("arrow-left",18)}</button>
          <div class="study-progress-text">${this.current+1} / ${this.cards.length}</div>
          <button class="icon-btn" id="study-close">${o("x",16)}</button></div>
        <div class="progress-bar-wrap mb-md"><div class="progress-bar-fill" style="width:${t}%"></div></div>
        <div class="study-content">
          <div id="flip-wrap"></div>
          <div id="answer-section" style="display:none">
            <p style="text-align:center;font-size:13px;color:var(--text-secondary);margin-bottom:var(--space-sm)">Como você foi?</p>
            <div class="answer-buttons">
              <button class="answer-btn wrong" data-type="wrong"><span class="emoji">${o("frown",26)}</span><span>Errei</span></button>
              <button class="answer-btn unsure" data-type="unsure"><span class="emoji">${o("help-circle",26)}</span><span>Quase</span></button>
              <button class="answer-btn right" data-type="right"><span class="emoji">${o("check-circle",26)}</span><span>Acertei</span></button>
            </div></div>
        </div>
      </div>`,m(),this.flipCard=new V(this.container.querySelector("#flip-wrap"),{front:e.front_text,back:e.back_text,onFlip:a=>{a&&(document.getElementById("answer-section").style.display="block")}}),this.flipCard.render(),(s=this.container.querySelector("#study-back"))==null||s.addEventListener("click",()=>{this.current>0?(this.current--,this._renderCard()):this._endSession()}),(i=this.container.querySelector("#study-close"))==null||i.addEventListener("click",()=>this._endSession()),this.container.querySelectorAll(".answer-btn").forEach(a=>{a.addEventListener("click",()=>this._answer(a.dataset.type))})}async _answer(e){if(this.stats[e]++,this.session)try{await C.recordAnswer(this.session.id,this.cards[this.current].id,e)}catch{}this.current++,this.current>=this.cards.length?this._renderResult():this._renderCard()}_renderResult(){var a,n;const e=this.stats.right+this.stats.wrong+this.stats.unsure,t=e?Math.round(this.stats.right/e*100):0;this.session&&this.session.finish({totalCards:e,rightCount:this.stats.right,wrongCount:this.stats.wrong,unsureCount:this.stats.unsure}).catch(()=>{});const s=t>=80?"trophy":t>=50?"thumbs-up":"dumbbell",i=t>=80?"Excelente!":t>=50?"Bom trabalho!":"Continue praticando!";this.container.innerHTML=`
      <div class="study-result animate-fade">
        <div class="result-emoji">${o(s,64)}</div>
        <h2 class="result-title">${i}</h2>
        <p style="color:var(--text-secondary)">Sessão concluída com ${e} cards</p>
        <div class="result-stats">
          <div class="result-stat-item"><div class="result-stat-value" style="color:var(--clr-success)">${this.stats.right}</div><div class="result-stat-label">Acertos</div></div>
          <div class="result-stat-item"><div class="result-stat-value" style="color:var(--clr-warning)">${this.stats.unsure}</div><div class="result-stat-label">Quase</div></div>
          <div class="result-stat-item"><div class="result-stat-value" style="color:var(--clr-danger)">${this.stats.wrong}</div><div class="result-stat-label">Erros</div></div></div>
        <div style="width:100%;background:var(--bg-card);border-radius:var(--radius-md);padding:var(--space-md);text-align:center">
          <div style="font-size:32px;font-weight:900;color:var(--clr-primary-light)">${t}%</div>
          <div style="font-size:13px;color:var(--text-secondary)">taxa de acerto</div></div>
        <div class="flex gap-sm w-full">
          <button class="btn btn-secondary flex-1" id="res-decks">Meus Decks</button>
          <button class="btn btn-primary flex-1" id="res-again">Estudar novamente</button></div>
      </div>`,m(),(a=this.container.querySelector("#res-decks"))==null||a.addEventListener("click",()=>window.router.navigate("/decks")),(n=this.container.querySelector("#res-again"))==null||n.addEventListener("click",()=>{this.current=0,this.stats={right:0,wrong:0,unsure:0},this.render()})}_renderEmpty(){var e;this.container.innerHTML=`
      <div class="study-result">
        <div class="result-emoji">${o("sparkles",64)}</div>
        <h2 class="result-title">Tudo em dia!</h2>
        <p style="color:var(--text-secondary);text-align:center">Não há cards para revisar agora. Volte mais tarde!</p>
        <button class="btn btn-primary mt-md" id="back-btn">${o("arrow-left",14)} Voltar aos Decks</button></div>`,m(),(e=this.container.querySelector("#back-btn"))==null||e.addEventListener("click",()=>window.router.navigate("/decks"))}_endSession(){window.router.navigate(`/deck/${this.deckId}`)}destroy(){}}class J{constructor(e){this.container=e,this.data=null}async render(){this.container.innerHTML=this._skeleton();try{this.data=await v.get("/dashboard")}catch{this.data={totalStudied:0,totalRight:0,totalWrong:0,totalSessions:0,accuracy:0,streak:0,hardestCards:[],easiestCards:[],recentActivity:[]}}this.container.innerHTML=this._template(),m()}_template(){const e=this.data,t=e.accuracy??k(e.totalRight,e.totalStudied);return`
      <div class="animate-fade">
        <div class="page-header"><h1>Estatísticas</h1></div>
        <div style="padding:var(--space-md)">
          <div class="stats-grid mb-md">
            <div class="stat-card"><div class="stat-icon">${o("book-open",22)}</div><div class="stat-value">${e.totalStudied??0}</div><div class="stat-label">Cards estudados</div></div>
            <div class="stat-card"><div class="stat-icon">${o("target",22)}</div><div class="stat-value">${t}%</div><div class="stat-label">Taxa de acerto</div></div>
            <div class="stat-card"><div class="stat-icon">${o("calendar",22)}</div><div class="stat-value">${e.totalSessions??0}</div><div class="stat-label">Sessões</div></div>
            <div class="stat-card"><div class="stat-icon">${o("flame",22)}</div><div class="stat-value">${e.streak??0}</div><div class="stat-label">Sequência (dias)</div></div>
          </div>
          <div class="card mb-md">
            <div style="font-weight:700;margin-bottom:var(--space-md)">Distribuição das respostas</div>
            ${this._renderDistBar(e.totalRight??0,e.totalUnsure??0,e.totalWrong??0)}
          </div>
          ${(e.hardestCards??[]).length>0?`
          <div class="section-header"><div class="section-title">${o("alert-triangle",18)} Mais difíceis</div></div>
          ${e.hardestCards.slice(0,5).map(s=>`
            <div class="card mb-sm flex items-center gap-md">
              <div style="flex:1"><div style="font-weight:600;font-size:14px">${s.frontText}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${s.wrongCount??0} erros · dificuldade ${(s.difficultyScore??1).toFixed(1)}</div></div>
              <div class="badge badge-danger">Hard</div></div>`).join("")}`:""}
          ${(e.easiestCards??[]).length>0?`
          <div class="section-header mt-md"><div class="section-title">${o("star",18)} Mais dominados</div></div>
          ${e.easiestCards.slice(0,5).map(s=>`
            <div class="card mb-sm flex items-center gap-md">
              <div style="flex:1"><div style="font-weight:600;font-size:14px">${s.frontText}</div>
                <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${s.rightCount??0} acertos · streak ${s.streak??0}</div></div>
              <div class="badge badge-success">Easy</div></div>`).join("")}`:""}
          ${(e.recentActivity??[]).length>0?`
          <div class="section-header mt-md"><div class="section-title">${o("clock",18)} Atividade recente</div></div>
          ${e.recentActivity.slice(0,5).map(s=>`
            <div class="card mb-sm flex items-center gap-md">
              <div style="font-size:28px">${o("book-open",28)}</div>
              <div style="flex:1"><div style="font-weight:600;font-size:14px">${s.deckName||"Sessão de estudo"}</div>
                <div style="font-size:12px;color:var(--text-secondary)">${s.totalCards} cards · ${k(s.rightCount,s.totalCards)}% acerto · ${F(s.startedAt)}</div></div></div>`).join("")}`:""}
          ${!this.data||!e.totalStudied?`
            <div class="empty-state mt-lg"><div class="empty-state-icon">${o("bar-chart-3",56)}</div>
              <div class="empty-state-title">Nenhum dado ainda</div>
              <div class="empty-state-text">Complete uma sessão de estudo para ver suas estatísticas aqui</div>
              <button class="btn btn-primary mt-md" id="start-study-btn">${o("zap",16)} Começar a estudar</button></div>`:""}
        </div>
      </div>`}_renderDistBar(e,t,s){const i=e+t+s;if(!i)return'<div style="color:var(--text-muted);font-size:13px">Estude para ver dados aqui</div>';const a=k(e,i),n=k(t,i),d=k(s,i);return`
      <div style="height:24px;border-radius:var(--radius-full);overflow:hidden;display:flex;margin-bottom:var(--space-sm)">
        <div style="width:${a}%;background:var(--clr-success)"></div>
        <div style="width:${n}%;background:var(--clr-warning)"></div>
        <div style="width:${d}%;background:var(--clr-danger)"></div></div>
      <div class="flex gap-md" style="font-size:12px">
        <div class="flex items-center gap-xs"><div style="width:10px;height:10px;border-radius:50%;background:var(--clr-success)"></div> Acertei ${a}%</div>
        <div class="flex items-center gap-xs"><div style="width:10px;height:10px;border-radius:50%;background:var(--clr-warning)"></div> Quase ${n}%</div>
        <div class="flex items-center gap-xs"><div style="width:10px;height:10px;border-radius:50%;background:var(--clr-danger)"></div> Errei ${d}%</div></div>`}_skeleton(){return`<div style="padding:var(--space-md)">${[1,2,3].map(()=>'<div style="height:80px;background:var(--bg-card);border-radius:var(--radius-lg);margin-bottom:8px;animation:pulse 1.5s infinite"></div>').join("")}</div>`}destroy(){}}const B={general:{label:"Geral",icon:"clock",desc:"Lembrete para estudar"},deck_review:{label:"Deck específico",icon:"library",desc:"Vinculado a um deck"},due_review:{label:"Revisão pendente",icon:"zap",desc:"Cards que precisam de revisão"}},q=[{value:"daily",label:"Diariamente"},{value:"weekdays",label:"Dias úteis"},{value:"weekly",label:"Semanalmente"}],Q=[{value:"push",icon:"bell",label:"Notificação push"},{value:"whatsapp",icon:"message-circle",label:"WhatsApp"},{value:"in_app",icon:"smartphone",label:"No app"}];class X{constructor(e){this.container=e,this.reminders=[],this.decks=[]}async render(){this.container.innerHTML=this._skeleton();try{const[e,t]=await Promise.all([v.get("/reminders"),b.fetchAll()]);this.reminders=e,this.decks=t}catch{this.reminders=[],this.decks=[]}this.container.innerHTML=this._template(),this._bindEvents(),m()}_template(){return`
      <div class="animate-fade">
        <div class="page-header"><h1>Lembretes</h1>
          <button class="icon-btn" id="btn-new-reminder">＋</button></div>
        <div style="padding:var(--space-md)">
          ${this.reminders.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">${o("bell-off",56)}</div>
              <div class="empty-state-title">Nenhum lembrete</div>
              <div class="empty-state-text">Crie lembretes para manter sua rotina de estudos em dia</div>
              <button class="btn btn-primary mt-md" id="btn-empty-new">+ Criar lembrete</button></div>
          `:this.reminders.map(e=>{var s;const t=B[e.type]||B.general;return`<div class="reminder-card" data-id="${e.id}">
              <div class="reminder-icon">${o(t.icon,22)}</div>
              <div class="reminder-info">
                <div class="reminder-title">${e.title}</div>
                <div class="reminder-meta">${e.timeOfDay||e.time_of_day} · ${((s=q.find(i=>i.value===e.frequency))==null?void 0:s.label)||e.frequency}${e.deckName?` · ${e.deckName}`:""}</div></div>
              <div class="flex items-center gap-sm">
                <label class="toggle"><input type="checkbox" class="toggle-reminder" data-id="${e.id}" ${e.isActive||e.is_active?"checked":""}><span class="toggle-slider"></span></label>
                <button class="icon-btn btn-delete-reminder" data-id="${e.id}" style="width:32px;height:32px">${o("trash-2",14)}</button></div>
            </div>`}).join("")}
        </div>
      </div>
      <button class="fab" id="fab-new-reminder">＋</button>`}_skeleton(){return`<div style="padding:var(--space-md)">${[1,2].map(()=>'<div style="height:72px;background:var(--bg-card);border-radius:var(--radius-lg);margin-bottom:8px;animation:pulse 1.5s infinite"></div>').join("")}</div>`}_bindEvents(){var t,s,i;const e=()=>this._openReminderModal();(t=this.container.querySelector("#btn-new-reminder"))==null||t.addEventListener("click",e),(s=this.container.querySelector("#fab-new-reminder"))==null||s.addEventListener("click",e),(i=this.container.querySelector("#btn-empty-new"))==null||i.addEventListener("click",e),this.container.querySelectorAll(".toggle-reminder").forEach(a=>{a.addEventListener("change",async n=>{try{await v.patch(`/reminders/${n.target.dataset.id}`,{isActive:n.target.checked})}catch(d){window.toast.error(d.message),n.target.checked=!n.target.checked}})}),this.container.querySelectorAll(".btn-delete-reminder").forEach(a=>{a.addEventListener("click",()=>{p.confirm({title:"Excluir lembrete",message:"Tem certeza que deseja excluir este lembrete?",confirmText:"Excluir",danger:!0,onConfirm:async()=>{try{await v.delete(`/reminders/${a.dataset.id}`),this.reminders=this.reminders.filter(n=>n.id!=a.dataset.id),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success("Lembrete excluído")}catch(n){window.toast.error(n.message)}}})})})}_openReminderModal(){const e=this.decks.map(s=>`<option value="${s.id}">${s.name}</option>`).join(""),t=new p({title:"Novo lembrete",content:`
        <div class="form-group"><label class="form-label">Tipo</label>
          <select id="rem-type" class="form-input">${Object.entries(B).map(([s,i])=>`<option value="${s}">${i.label}</option>`).join("")}</select></div>
        <div class="form-group" id="deck-select-group" style="display:none"><label class="form-label">Deck</label>
          <select id="rem-deck" class="form-input"><option value="">Selecione um deck</option>${e}</select></div>
        <div class="form-group"><label class="form-label">Título</label>
          <input id="rem-title" type="text" class="form-input" placeholder="Ex.: Hora de estudar!"></div>
        <div class="form-group"><label class="form-label">Horário</label>
          <input id="rem-time" type="time" class="form-input" value="08:00"></div>
        <div class="form-group"><label class="form-label">Frequência</label>
          <select id="rem-freq" class="form-input">${q.map(s=>`<option value="${s.value}">${s.label}</option>`).join("")}</select></div>
        <div class="form-group"><label class="form-label">Canal</label>
          <select id="rem-channel" class="form-input">${Q.map(s=>`<option value="${s.value}">${s.label}</option>`).join("")}</select></div>
        <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="rem-cancel">Cancelar</button>
          <button class="btn btn-primary flex-1" id="rem-save">Criar</button></div>`});t.open(),document.getElementById("rem-type").addEventListener("change",s=>{document.getElementById("deck-select-group").style.display=s.target.value==="deck_review"?"":"none"}),document.getElementById("rem-cancel").addEventListener("click",()=>t.close()),document.getElementById("rem-save").addEventListener("click",async()=>{const s=document.getElementById("rem-type").value,i=document.getElementById("rem-title").value.trim(),a=document.getElementById("rem-time").value,n=document.getElementById("rem-freq").value,d=document.getElementById("rem-channel").value,c=s==="deck_review"?document.getElementById("rem-deck").value:null;if(!i){window.toast.error("Título é obrigatório");return}if(s==="deck_review"&&!c){window.toast.error("Selecione um deck");return}const l=document.getElementById("rem-save");l.disabled=!0,l.textContent="Criando...";try{const u=await v.post("/reminders",{type:s,title:i,timeOfDay:a,frequency:n,channel:d,deckId:c||null,isActive:!0});this.reminders.unshift(u),t.close(),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success("Lembrete criado!")}catch(u){window.toast.error(u.message),l.disabled=!1,l.textContent="Criar"}})}destroy(){}}const A="fliply_theme",S={getPreference(){return localStorage.getItem(A)||"system"},setTheme(r){localStorage.setItem(A,r),this.apply()},apply(){const r=this.getPreference(),e=document.documentElement,t=r==="dark"||r==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches;t?(e.classList.add("dark-theme"),e.classList.remove("light-theme"),e.setAttribute("data-theme","dark")):(e.classList.add("light-theme"),e.classList.remove("dark-theme"),e.setAttribute("data-theme","light")),this._updateStatusBar(t)},async _updateStatusBar(r){if(window.Capacitor&&window.Capacitor.Plugins.StatusBar){const{StatusBar:e}=window.Capacitor.Plugins;try{await e.setStyle({style:r?"DARK":"LIGHT"}),await e.setBackgroundColor({color:r?"#0D0D1A":"#F8FAFC"})}catch(t){console.warn("StatusBar plugin error",t)}}},init(){this.apply(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.getPreference()==="system"&&this.apply()})}};class Z{constructor(e){this.container=e,this.user=f.getUser(),this.settings={}}async render(){try{this.settings=await v.get("/users/settings")}catch{this.settings={dailyGoal:20,sessionSize:10,smartOrder:!0,whatsappEnabled:!1,notificationsEnabled:!0}}this.container.innerHTML=this._template(),this._bindEvents(),m()}_template(){const e=this.user||{},t=this.settings,s=S.getPreference(),i={system:"Padrão do sistema",light:"Claro",dark:"Escuro"};return`
      <div class="animate-fade">
        <div class="page-header"><h1>Configurações</h1></div>
        <div style="padding:var(--space-md)">
          <div class="card flex items-center gap-md mb-md" id="edit-profile" style="cursor:pointer">
            <div class="avatar avatar-md">${z(e.name)}</div>
            <div style="flex:1"><div style="font-weight:700">${e.name||"Usuário"}</div>
              <div style="font-size:13px;color:var(--text-secondary)">${e.email||""}</div></div>
            <div style="color:var(--text-muted)">›</div></div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Estudo</div>
          <div class="settings-group mb-md">
            <div class="settings-item" id="edit-daily-goal">
              <div class="settings-item-icon" style="background:rgba(124,58,237,0.15)">${o("target",18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Meta diária</div><div class="settings-item-sub">${t.dailyGoal??20} cards por dia</div></div>
              <div class="settings-item-right">›</div></div>
            <div class="settings-item" id="edit-session-size">
              <div class="settings-item-icon" style="background:rgba(16,185,129,0.15)">${o("package",18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Tamanho da sessão</div><div class="settings-item-sub">${t.sessionSize??10} cards por sessão</div></div>
              <div class="settings-item-right">›</div></div>
            <div class="settings-item">
              <div class="settings-item-icon" style="background:rgba(245,158,11,0.15)">${o("brain",18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Ordem inteligente</div><div class="settings-item-sub">Priorizar cards difíceis</div></div>
              <label class="toggle"><input type="checkbox" id="toggle-smart" ${t.smartOrder!==!1?"checked":""}><span class="toggle-slider"></span></label></div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Aparência</div>
          <div class="settings-group mb-md">
            <div class="settings-item" id="edit-theme">
              <div class="settings-item-icon" style="background:rgba(124,58,237,0.15)">${o("palette",18)}</div>
              <div class="settings-item-info">
                <div class="settings-item-title">Tema</div>
                <div class="settings-item-sub">${i[s]}</div>
              </div>
              <div class="settings-item-right">›</div>
            </div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Notificações</div>
          <div class="settings-group mb-md">
            <div class="settings-item">
              <div class="settings-item-icon" style="background:rgba(59,130,246,0.15)">${o("bell",18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Push notifications</div><div class="settings-item-sub">Receber alertas no celular</div></div>
              <label class="toggle"><input type="checkbox" id="toggle-notif" ${t.notificationsEnabled!==!1?"checked":""}><span class="toggle-slider"></span></label></div>
            <div class="settings-item">
              <div class="settings-item-icon" style="background:rgba(16,185,129,0.15)">${o("message-circle",18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Desafios WhatsApp</div><div class="settings-item-sub">${e.whatsappPhone?e.whatsappPhone:"Vincule seu número"}</div></div>
              <label class="toggle"><input type="checkbox" id="toggle-whatsapp" ${t.whatsappEnabled?"checked":""}><span class="toggle-slider"></span></label></div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-sm)">Conta</div>
          <div class="settings-group mb-md">
            <div class="settings-item" id="edit-whatsapp">
              <div class="settings-item-icon" style="background:rgba(16,185,129,0.15)">${o("smartphone",18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Número WhatsApp</div><div class="settings-item-sub">${e.whatsappPhone||"Não vinculado"}</div></div>
              <div class="settings-item-right">›</div></div>
            <div class="settings-item" id="change-password">
              <div class="settings-item-icon" style="background:rgba(245,158,11,0.15)">${o("lock",18)}</div>
              <div class="settings-item-info"><div class="settings-item-title">Alterar senha</div></div>
              <div class="settings-item-right">›</div></div>
          </div>

          <button class="btn btn-danger btn-block mt-md" id="btn-logout">Sair da conta</button>
        </div>
      </div>`}_bindEvents(){var t,s,i,a,n,d,c,l,u,h;(t=this.container.querySelector("#edit-profile"))==null||t.addEventListener("click",()=>this._editProfile()),(s=this.container.querySelector("#edit-whatsapp"))==null||s.addEventListener("click",()=>this._editWhatsapp()),(i=this.container.querySelector("#edit-daily-goal"))==null||i.addEventListener("click",()=>this._editNumber("dailyGoal","Meta diária","cards por dia")),(a=this.container.querySelector("#edit-session-size"))==null||a.addEventListener("click",()=>this._editNumber("sessionSize","Tamanho da sessão","cards por sessão")),(n=this.container.querySelector("#edit-theme"))==null||n.addEventListener("click",()=>this._editTheme()),(d=this.container.querySelector("#change-password"))==null||d.addEventListener("click",()=>this._changePassword()),(c=this.container.querySelector("#btn-logout"))==null||c.addEventListener("click",()=>{p.confirm({title:"Sair",message:"Tem certeza que deseja sair da conta?",confirmText:"Sair",danger:!0,onConfirm:()=>f.logout()})});const e=async(g,y)=>{try{await v.patch("/users/settings",{[g]:y})}catch(N){window.toast.error(N.message)}};(l=this.container.querySelector("#toggle-smart"))==null||l.addEventListener("change",g=>e("smartOrder",g.target.checked)),(u=this.container.querySelector("#toggle-notif"))==null||u.addEventListener("change",g=>e("notificationsEnabled",g.target.checked)),(h=this.container.querySelector("#toggle-whatsapp"))==null||h.addEventListener("change",g=>{var y;g.target.checked&&!((y=this.user)!=null&&y.whatsappPhone)?(g.target.checked=!1,this._editWhatsapp()):e("whatsappEnabled",g.target.checked)})}_editTheme(){const e=S.getPreference(),t=[{id:"system",label:"Padrão do sistema",desc:"Segue as configurações do seu dispositivo"},{id:"light",label:"Claro",desc:"Visual limpo com cores claras"},{id:"dark",label:"Escuro",desc:"Ideal para ambientes com pouca luz"}],s=new p({title:"Tema do aplicativo",content:`
        <div class="flex flex-col gap-sm">
          ${t.map(a=>`
            <div class="settings-item theme-opt ${a.id===e?"active-opt":""}" data-id="${a.id}" style="border-radius: var(--radius-md); border: 1px solid var(--border-color)">
              <div style="flex:1">
                <div style="font-weight:700">${a.label}</div>
                <div style="font-size:12px; color:var(--text-secondary)">${a.desc}</div>
              </div>
              <div class="theme-check" style="${a.id===e?"color:var(--clr-primary-light)":"display:none"}">${o("check",18)}</div>
            </div>
          `).join("")}
        </div>
      `});s.open(),m();const i=document.createElement("style");i.id="theme-modal-styles",i.innerHTML=`
      .active-opt { border-color: var(--clr-primary-light) !important; background: var(--clr-primary-glow) !important; }
    `,document.head.appendChild(i),document.querySelectorAll(".theme-opt").forEach(a=>{a.addEventListener("click",()=>{var d;const n=a.dataset.id;S.setTheme(n),s.close(),this.render(),(d=document.getElementById("theme-modal-styles"))==null||d.remove()})})}_editProfile(){const e=this.user||{},t=new p({title:"Editar perfil",content:`
      <div class="form-group"><label class="form-label">Nome</label><input id="prof-name" type="text" class="form-input" value="${e.name||""}"></div>
      <div class="form-group"><label class="form-label">E-mail</label><input id="prof-email" type="email" class="form-input" value="${e.email||""}"></div>
      <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="prof-cancel">Cancelar</button><button class="btn btn-primary flex-1" id="prof-save">Salvar</button></div>`});t.open(),document.getElementById("prof-cancel").addEventListener("click",()=>t.close()),document.getElementById("prof-save").addEventListener("click",async()=>{const s=document.getElementById("prof-name").value.trim(),i=document.getElementById("prof-email").value.trim();if(!s||!i){window.toast.error("Preencha todos os campos");return}const a=document.getElementById("prof-save");a.disabled=!0,a.textContent="Salvando...";try{await f.updateProfile({name:s,email:i}),this.user=f.getUser(),t.close(),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success("Perfil atualizado!")}catch(n){window.toast.error(n.message),a.disabled=!1,a.textContent="Salvar"}})}_editWhatsapp(){var t;const e=new p({title:"Número WhatsApp",content:`
      <p style="color:var(--text-secondary);margin-bottom:var(--space-md);font-size:14px">Vincule seu número para receber desafios e lembretes via WhatsApp</p>
      <div class="form-group"><label class="form-label">Número (com DDD e código do país)</label>
        <input id="wa-phone" type="tel" class="form-input" placeholder="+55 11 99999-9999" value="${((t=this.user)==null?void 0:t.whatsappPhone)||""}">
        <span class="form-hint">Ex.: +5511999999999</span></div>
      <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="wa-cancel">Cancelar</button><button class="btn btn-primary flex-1" id="wa-save">Salvar</button></div>`});e.open(),document.getElementById("wa-cancel").addEventListener("click",()=>e.close()),document.getElementById("wa-save").addEventListener("click",async()=>{const s=document.getElementById("wa-phone").value.trim();if(!s){window.toast.error("Digite o número");return}try{await f.updateProfile({whatsappPhone:s}),this.user=f.getUser(),e.close(),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success("Número vinculado!")}catch(i){window.toast.error(i.message)}})}_editNumber(e,t,s){const i=this.settings[e]||(e==="dailyGoal"?20:10),a=new p({title:t,content:`
      <div class="form-group"><label class="form-label">Quantidade (${s})</label>
        <input id="num-input" type="number" class="form-input" value="${i}" min="1" max="${e==="dailyGoal"?200:50}"></div>
      <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="num-cancel">Cancelar</button><button class="btn btn-primary flex-1" id="num-save">Salvar</button></div>`});a.open(),document.getElementById("num-cancel").addEventListener("click",()=>a.close()),document.getElementById("num-save").addEventListener("click",async()=>{const n=parseInt(document.getElementById("num-input").value);if(!n||n<1){window.toast.error("Valor inválido");return}try{await v.patch("/users/settings",{[e]:n}),this.settings[e]=n,a.close(),this.container.innerHTML=this._template(),this._bindEvents(),m(),window.toast.success("Configuração salva!")}catch(d){window.toast.error(d.message)}})}_changePassword(){const e=new p({title:"Alterar senha",content:`
      <div class="form-group"><label class="form-label">Senha atual</label><input id="pw-current" type="password" class="form-input" placeholder="••••••••"></div>
      <div class="form-group"><label class="form-label">Nova senha</label><input id="pw-new" type="password" class="form-input" placeholder="Mínimo 8 caracteres"></div>
      <div class="form-group"><label class="form-label">Confirmar nova senha</label><input id="pw-confirm" type="password" class="form-input" placeholder="Repita a nova senha"></div>
      <div class="flex gap-sm mt-md"><button class="btn btn-secondary flex-1" id="pw-cancel">Cancelar</button><button class="btn btn-primary flex-1" id="pw-save">Alterar</button></div>`});e.open(),document.getElementById("pw-cancel").addEventListener("click",()=>e.close()),document.getElementById("pw-save").addEventListener("click",async()=>{const t=document.getElementById("pw-current").value,s=document.getElementById("pw-new").value,i=document.getElementById("pw-confirm").value;if(!t||!s){window.toast.error("Preencha todos os campos");return}if(s.length<8){window.toast.error("Senha deve ter pelo menos 8 caracteres");return}if(s!==i){window.toast.error("Senhas não conferem");return}try{await v.post("/auth/change-password",{currentPassword:t,newPassword:s}),e.close(),window.toast.success("Senha alterada!")}catch(a){window.toast.error(a.message)}})}destroy(){}}const P={"/onboarding":H,"/login":R,"/register":O,"/home":Y,"/decks":U,"/deck/:id":W,"/study/:deckId":K,"/dashboard":J,"/reminders":X,"/settings":Z};class ee{constructor(){this.currentPage=null}init(){window.addEventListener("hashchange",()=>this.handleRoute()),this.handleRoute()}handleRoute(){var n;const e=window.location.hash.slice(1)||"/home",t=document.getElementById("view-container");let s=null,i={};for(const[d,c]of Object.entries(P)){const l=this._match(d,e);if(l!==null){s=c,i=l;break}}s||(s=P["/home"]),window.dispatchEvent(new CustomEvent("routechange",{detail:{route:e}})),(n=this.currentPage)!=null&&n.destroy&&this.currentPage.destroy(),t.innerHTML="",t.scrollTop=0,this.currentPage=new s(t,i);const a=this.currentPage.render();a&&typeof a.then=="function"?a.then(()=>m()):m()}_match(e,t){const s=e.split("/"),i=t.split("?")[0].split("/");if(s.length!==i.length)return null;const a={};for(let n=0;n<s.length;n++)if(s[n].startsWith(":"))a[s[n].slice(1)]=decodeURIComponent(i[n]);else if(s[n]!==i[n])return null;return a}navigate(e){window.location.hash=e}back(){window.history.back()}}const te=[{route:"/home",icon:"home",label:"Início"},{route:"/decks",icon:"layers",label:"Decks"},{route:"/dashboard",icon:"bar-chart-3",label:"Stats"},{route:"/reminders",icon:"bell",label:"Lembretes"},{route:"/settings",icon:"settings",label:"Config"}];class se{constructor(e){this.currentRoute=e,this.container=document.getElementById("bottom-nav")}render(){this.container.innerHTML=`
      <nav class="bottom-nav">
        ${te.map(e=>`
            <button class="bottom-nav-item ${this.currentRoute===e.route||e.route!=="/home"&&this.currentRoute.startsWith(e.route)?"active":""}" data-route="${e.route}">
              <span class="bottom-nav-icon">${o(e.icon,22)}</span>
              <span class="bottom-nav-label">${e.label}</span>
            </button>
          `).join("")}
      </nav>
    `,this.container.querySelectorAll(".bottom-nav-item").forEach(e=>{e.addEventListener("click",()=>{window.router.navigate(e.dataset.route)})}),m()}}const D={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"};class ie{show(e,t="info",s=3e3){const i=document.getElementById("toast-container"),a=document.createElement("div");a.className=`toast ${t}`,a.innerHTML=`<span>${D[t]||D.info}</span><span>${e}</span>`,i.appendChild(a),setTimeout(()=>a.remove(),s)}success(e){this.show(e,"success")}error(e){this.show(e,"error")}warning(e){this.show(e,"warning")}info(e){this.show(e,"info")}}class ae{show(){document.getElementById("loader").classList.add("active")}hide(){document.getElementById("loader").classList.remove("active")}}window.toast=new ie;window.loader=new ae;async function ne(){S.init(),window.router=new ee,window.router.init();const r=["/onboarding","/login","/register","/forgot-password"];window.addEventListener("routechange",s=>{const i=s.detail.route,a=r.some(d=>i.startsWith(d)),n=document.getElementById("bottom-nav");a?n.innerHTML="":new se(i).render()});const e=f.isAuthenticated();!localStorage.getItem("fliply_visited")&&!e?window.router.navigate("/onboarding"):e?window.router.navigate("/home"):window.router.navigate("/login")}ne();
