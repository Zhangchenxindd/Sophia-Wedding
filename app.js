const categoryNames={french:'法式复古',outdoor:'户外纪实',chinese:'东方婚礼',guest:'真实客片'};
const defaultWorks=[
{id:'1',title:'巴黎旧梦',category:'french',src:'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1500&q=85'},
{id:'2',title:'花园来信',category:'outdoor',src:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85'},
{id:'3',title:'白色回廊',category:'french',src:'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85'},
{id:'4',title:'良辰',category:'chinese',src:'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1500&q=85'},
{id:'5',title:'海风与誓言',category:'outdoor',src:'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85'},
{id:'6',title:'真实的心动',category:'guest',src:'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85'}
];
let works=JSON.parse(localStorage.getItem('sophiaWorks')||'null')||defaultWorks;
let activeFilter='all';let currentIndex=0;
const gallery=document.querySelector('#gallery');
function renderGallery(){const list=activeFilter==='all'?works:works.filter(w=>w.category===activeFilter);gallery.innerHTML=list.map((w,i)=>`<article class="gallery-item reveal visible" data-id="${w.id}" tabindex="0"><img src="${w.src}" alt="${w.title}" loading="lazy"><div class="gallery-caption"><strong>${w.title}</strong><span>${categoryNames[w.category]||w.category}</span></div></article>`).join('');gallery.querySelectorAll('.gallery-item').forEach((el)=>{el.onclick=()=>openLightbox(el.dataset.id);el.onkeydown=e=>{if(e.key==='Enter')openLightbox(el.dataset.id)}})}
function saveWorks(){localStorage.setItem('sophiaWorks',JSON.stringify(works));renderGallery();renderAdminList()}
function openLightbox(id){const list=activeFilter==='all'?works:works.filter(w=>w.category===activeFilter);currentIndex=list.findIndex(w=>w.id===id);showLightboxItem(list);document.querySelector('#lightbox').showModal()}
function showLightboxItem(list){const w=list[currentIndex];if(!w)return;lightboxImage.src=w.src;lightboxTitle.textContent=w.title;lightboxCategory.textContent=categoryNames[w.category]||w.category}
renderGallery();
document.querySelectorAll('.filter-btn').forEach(btn=>btn.onclick=()=>{document.querySelector('.filter-btn.active').classList.remove('active');btn.classList.add('active');activeFilter=btn.dataset.filter;renderGallery()});
const lightbox=document.querySelector('#lightbox');document.querySelector('.lightbox-close').onclick=()=>lightbox.close();document.querySelector('.lightbox-prev').onclick=()=>{const list=activeFilter==='all'?works:works.filter(w=>w.category===activeFilter);currentIndex=(currentIndex-1+list.length)%list.length;showLightboxItem(list)};document.querySelector('.lightbox-next').onclick=()=>{const list=activeFilter==='all'?works:works.filter(w=>w.category===activeFilter);currentIndex=(currentIndex+1)%list.length;showLightboxItem(list)};
window.addEventListener('scroll',()=>document.querySelector('.site-header').classList.toggle('scrolled',scrollY>40));
document.querySelector('.menu-toggle').onclick=e=>{const nav=document.querySelector('.main-nav');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',nav.classList.contains('open'))};document.querySelectorAll('.main-nav a').forEach(a=>a.onclick=()=>document.querySelector('.main-nav').classList.remove('open'));
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelector('#bookingForm').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const leads=JSON.parse(localStorage.getItem('sophiaLeads')||'[]');leads.push({...data,time:new Date().toLocaleString()});localStorage.setItem('sophiaLeads',JSON.stringify(leads));formTip.textContent='预约信息已提交，我们会尽快与您联系。';e.target.reset()};
const adminModal=document.querySelector('#adminModal');adminEntry.onclick=()=>adminModal.showModal();adminClose.onclick=()=>adminModal.close();
loginForm.onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);if(d.get('username')==='admin'&&d.get('password')==='sophia2026'){loginPanel.hidden=true;dashboardPanel.hidden=false;sessionStorage.setItem('sophiaAdmin','1');renderAdminList()}else loginTip.textContent='账号或密码不正确。'};
logoutBtn.onclick=()=>{sessionStorage.removeItem('sophiaAdmin');dashboardPanel.hidden=true;loginPanel.hidden=false};
if(sessionStorage.getItem('sophiaAdmin')==='1'){loginPanel.hidden=true;dashboardPanel.hidden=false}
uploadForm.onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),file=d.get('image');if(!file||!file.type.startsWith('image/'))return uploadTip.textContent='请选择图片文件。';if(file.size>3*1024*1024)return uploadTip.textContent='图片过大，请压缩到 3MB 以内。';const reader=new FileReader();reader.onload=()=>{works.unshift({id:Date.now().toString(),title:d.get('title'),category:d.get('category'),src:reader.result});saveWorks();uploadTip.textContent='作品已发布。';e.target.reset()};reader.readAsDataURL(file)};
function renderAdminList(){if(!document.querySelector('#adminList'))return;adminList.innerHTML=works.map(w=>`<div class="admin-row"><img src="${w.src}" alt=""><div><strong>${w.title}</strong><br><small>${categoryNames[w.category]||w.category}</small></div><button data-del="${w.id}">删除</button></div>`).join('');adminList.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(confirm('确定删除这组作品吗？')){works=works.filter(w=>w.id!==b.dataset.del);saveWorks()}})}
renderAdminList();
