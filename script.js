// small helper: smooth scroll to section
function scrollToSection(id){
    const el = document.getElementById(id);
    if(!el) return window.scrollTo({top:0,behavior:'smooth'});
    window.scrollTo({top:el.offsetTop - 80,behavior:'smooth'});
}

// navbar link active on scroll
const links = document.querySelectorAll('.nav-link');
const sections = ['home','about','resume','projects','reflections'];
const opts = {root:null,rootMargin:'-40% 0px -40% 0px',threshold:0};
const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
    if(e.isIntersecting){
        links.forEach(a=>a.classList.remove('active'));
        const id = e.target.id;
        const link = document.querySelector('.nav-link[href="#'+id+'"]');
        if(link) link.classList.add('active');
    }
    });
},opts);
sections.forEach(s=>{const el=document.getElementById(s); if(el) obs.observe(el);});

// reveal animations on scroll
const reveals = document.querySelectorAll('.reveal, .fade-left');
const rObs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); rObs.unobserve(e.target); } });
},{threshold:0.15});
reveals.forEach(r=>rObs.observe(r));

// auto-fetch GitHub repositories dynamically
fetch('https://api.github.com/users/aishalaily/repos')
.then(response => response.json())
.then(repos => {
    const track = document.getElementById('github-projects');
    const latest = repos
    .filter(r => !r.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 9); 

    latest.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'github-project-card';
    card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description provided.'}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;
    track.appendChild(card);
    });

    // slider otomatis (3 card per slide)
    let index = 0;
    const total = Math.ceil(latest.length / 3);
    function slideProjects() {
    track.style.transform = `translateX(-${index * 100}%)`;
    }

    setInterval(() => {
    index = (index + 1) % total;
    slideProjects();
    }, 4000);
})
.catch(err => {
    console.error('Error loading GitHub repos:', err);
    document.getElementById('github-projects').innerHTML =
    '<p style="color:#aaa;">Failed to load GitHub repositories.</p>';
});

// set year
document.getElementById('year').textContent = new Date().getFullYear();

// mobile: clicking nav link smooth scroll
document.querySelectorAll('.nav-link').forEach(a=>{
    a.addEventListener('click',e=>{ e.preventDefault(); const href=a.getAttribute('href').replace('#',''); scrollToSection(href); });
});