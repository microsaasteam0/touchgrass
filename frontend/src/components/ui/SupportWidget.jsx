import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, HelpCircle, ChevronRight, ChevronDown, Search, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supportClient } from '../../lib/support/client.js'

export default function SupportWidget() {
  const { user, isAuthenticated } = useAuth()

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('home') // home | messages | faq
  const [conversationStep, setConversationStep] = useState(0) // 0: greeting, 1: email, 2: category, 3: message
  const [email, setEmail] = useState(user?.email || '')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ from:'bot', text:'Hello! I am your AI assistant 🤖'}])

  // FAQ logic
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(()=>{ if(user?.email) setEmail(user.email) }, [user])
  useEffect(()=>{ document.body.style.overflow=open?'hidden':'unset'; return()=>document.body.style.overflow='unset' }, [open])

  const faqs = [
    { q:'How do streaks work?', a:'Streaks track consecutive days you verify outdoor time. Each verified day adds to your streak. Miss a day, and your streak resets to zero—but your progress stays recorded in your history.' },
    { q:'Can I cancel my subscription?', a:'Yes, anytime from settings.' },
    { q:'How do I verify my day?', a:'Click "Verify Today," share proof (photo, location, or activity details), and submit. Verification takes under 30 seconds and confirms you completed your daily outdoor commitment.' },
    { q:'Is my data secure?', a:'Yes. Enterprise-grade encryption is used.' }
  ]

  const botReply = (text) => setChatMessages(prev=>[...prev,{from:'bot',text}])
  const userReply = (text) => setChatMessages(prev=>[...prev,{from:'user',text}])

  const nextStep = () => {
    if(conversationStep===0){ botReply('Can I know your email?'); setConversationStep(1) }
    else if(conversationStep===1){ botReply('Select the type of support you need:'); setConversationStep(2) }
    else if(conversationStep===2){ botReply('Please write your message in detail'); setConversationStep(3) }
    else if(conversationStep===3){ handleSubmit() }
  }

  

  const handleUserInput = (value) => {
  if(!value) return
  // If we are at the email step, validate email
  if(conversationStep === 1) {
    if(!value.includes('@') || !value.includes('.')) {
      botReply('⚠️ Please enter a valid email address.')
      return
    }
    setEmail(value)
  }
  userReply(value)

  if(conversationStep===3) setMessage(value)
  setTimeout(nextStep, 500)
}
  const handleCategoryClick = (type) => {
    userReply(type)
    setCategory(type)
    setTimeout(nextStep,500)
  }

  const handleSubmit = async () => {
  if(!email.includes('@') || !email.includes('.') || !category || !message) { 
    toast.error('Please complete all fields with a valid email (must include "@" and ".")'); 
    return 
  }
  setSending(true)
  try{
    await supportClientSafe.submitTicket({
      product:'TouchGrass', category, user_email:email, message,
      metadata:{ page:typeof window!=='undefined'?window.location.pathname:'', isAuthenticated, username:user?.username||'Guest' }
    })
    botReply('✅ Thanks! Your message has been sent.')
    setMessage(''); setCategory(''); setConversationStep(0); setOpen(false)
  } catch { botReply('Failed to send message') }
  finally{ setSending(false) }
}
  return (
    <>
      <AnimatePresence>{open && <motion.div className="sw-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} />}</AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div className="sw-widget" onClick={e=>e.stopPropagation()}
            initial={{y:30,opacity:0,scale:0.95}} animate={{y:0,opacity:1,scale:1}} exit={{y:30,opacity:0,scale:0.95}} transition={{type:'spring',damping:25}}
          >
            {/* HEADER */}
            <div className="sw-header">
              <div className="sw-header-left">
                <div className="sw-icon">🤖</div>
                <div><h3 className="sw-title">TouchGrass</h3><p className="sw-subtitle">AI Assistance</p></div>
              </div>
              <button className="sw-close-btn" onClick={()=>setOpen(false)}><X /></button>
            </div>

            {/* CONTENT */}
            <div className="sw-content">
              {tab==='home' && <>
                <div className="sw-card"><h4>Hi there! 👋</h4><p>Welcome to TouchGrass support.</p></div>
                <button className="sw-card-btn" onClick={()=>{ setTab('messages'); nextStep() }}><span><Send size={16}/> Start AI Assistant</span> <ChevronRight/></button>
                <button className="sw-card-btn" onClick={()=>setTab('faq')}><span><HelpCircle size={16}/> Knowledge Base</span> <ChevronRight/></button>
                {/* <div className="sw-tip"><strong>PRO TIP</strong><p>Convert LinkedIn posts into Twitter threads instantly.</p></div> */}
              </>}

              {tab==='messages' && <>
                <div className="chat-area">
                  {chatMessages.map((m,i)=>(
                    <div key={i} className={m.from==='bot'?'chat-bot':'chat-user'}>{m.text}</div>
                  ))}
                </div>

                {(conversationStep===1 || conversationStep===3) && (
                  <div className="chat-input-area">
                    <input type="text" className="sw-input" placeholder="Type here..." 
                      onKeyDown={e=>{if(e.key==='Enter'){handleUserInput(e.target.value); e.target.value=''}}} />
                    <button className="sw-send-btn" 
                      onClick={()=>{ const val=document.querySelector('.chat-input-area input').value; handleUserInput(val); document.querySelector('.chat-input-area input').value=''}}><Send /></button>
                  </div>
                )}

                {conversationStep===2 && (
                  <div className="category-options">
                    {['support','feedback','bug','feature'].map(c=>(
                      <button key={c} className="sw-card-btn" onClick={()=>handleCategoryClick(c)}>{c}</button>
                    ))}
                  </div>
                )}
              </>}

              {tab==='faq' && <>
                <div className="sw-search-container">
                  <Search className="sw-search-icon" />
                  <input className="sw-input" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                {faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase())).map((f,i)=>(
                  <div key={i} className="sw-card faq-card">
                    <button onClick={()=>setExpanded(expanded===i?null:i)} className="faq-btn">
                      {f.q} <ChevronDown className={`faq-chevron ${expanded===i?'rotate':''}`} />
                    </button>
                    {expanded===i && <p className="faq-answer">{f.a}</p>}
                  </div>
                ))}
              </>}
            </div>

            {/* TABS */}
            <div className="sw-tabs">
              <Tab icon={Home} label="Home" active={tab==='home'} onClick={()=>setTab('home')} />
              <Tab icon={Send} label="Messages" active={tab==='messages'} onClick={()=>setTab('messages')} />
              <Tab icon={HelpCircle} label="Help" active={tab==='faq'} onClick={()=>setTab('faq')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BUTTON */}
      <div className="sw-floating-btn-container">
        <button className="sw-floating-btn" onClick={()=>setOpen(o=>!o)}>{open?<X size={26}/>:<MessageCircle size={26}/>}</button>
      </div>

      {/* NORMAL CSS */}
      <style>{`
        .sw-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:40;}
        .sw-widget{position:fixed;bottom:96px;right:16px;width:360px;height:600px;background:#1e1e1e;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.5);display:flex;flex-direction:column;overflow:hidden;z-index:50;font-family:sans-serif;border:1px solid #2a2a2a;}
        .sw-header{background:linear-gradient(90deg,#22c55e,#3b82f6);color:#ffffff;padding:16px;display:flex;justify-content:space-between;align-items:center;}
        .sw-header-left{display:flex;gap:8px;align-items:center;}
        .sw-icon{font-size:24px;}
        .sw-title{font-weight:bold;margin:0;}
        .sw-subtitle{font-size:12px;opacity:0.9;margin:0;}
        .sw-close-btn{background:none;border:none;color:#ffffff;cursor:pointer;}
        .sw-content{flex:1;padding:16px;overflow-y:auto;background:#0a0a0a;}
        .sw-card{background:#1e1e1e;padding:12px;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:1px solid #2a2a2a;}
        .sw-card-btn{width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;border:none;background:#1e1e1e;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3);margin-bottom:8px;border:1px solid #2a2a2a;}
        .sw-card-btn:hover{background:#2a2a2a;}
        .sw-tip{background:#1e1e1e;padding:12px;border-radius:12px;font-size:12px;border:1px solid #2a2a2a;}
        .sw-input{width:100%;padding:10px;border-radius:8px;border:1px solid #3f3f46;margin-bottom:8px;box-sizing:border-box;background:#1e1e1e;color:#ffffff;}
        .sw-textarea{width:100%;padding:10px;border-radius:8px;border:1px solid #3f3f46;margin-bottom:8px;box-sizing:border-box;resize:none;background:#1e1e1e;color:#ffffff;}
        .sw-send-btn{background:#22c55e;color:#ffffff;padding:10px;border:none;border-radius:8px;cursor:pointer;}
        .sw-send-btn:hover{background:#16a34a;}
        .sw-search-container{position:relative;margin-bottom:8px;}
        .sw-search-icon{position:absolute;top:50%;left:10px;transform:translateY(-50%);opacity:0.5;color:#a1a1aa;}
        .sw-search-container input{padding-left:32px;}
        .faq-btn{width:100%;display:flex;justify-content:space-between;padding:12px;border:none;background:none;cursor:pointer;color:#ffffff;}
        .faq-chevron{transition:transform 0.2s ease;}
        .faq-chevron.rotate{transform:rotate(180deg);}
        .faq-answer{padding:8px 0 0 0;font-size:13px;color:#a1a1aa;}
        .sw-tabs{height:56px;display:flex;border-top:1px solid #2a2a2a;background:#1e1e1e;}
        .sw-tabs button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border:none;background:none;cursor:pointer;font-size:12px;opacity:0.6;color:#a1a1aa;}
        .sw-tabs button.active{color:#22c55e;opacity:1;}
        .sw-floating-btn-container{position:fixed;bottom:32px;right:32px;z-index:60;}
        .sw-floating-btn{width:64px;height:64px;border-radius:50%;background: linear-gradient(135deg,#22c55e,#3b82f6);color:#ffffff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px rgba(0,0,0,0.5);transition:transform 0.2s;}
        .sw-floating-btn:hover{transform:scale(1.05);}
        .chat-area{max-height:400px;overflow-y:auto;margin-bottom:8px;display:flex;flex-direction:column;gap:4px;}
        .chat-bot{background:#1e1e1e;padding:8px 12px;border-radius:12px;margin-bottom:6px;width:fit-content;max-width:80%;border:1px solid #2a2a2a;color:#ffffff;}
        .chat-user{background:#22c55e;color:#ffffff;padding:8px 12px;border-radius:12px;margin-bottom:6px;width:fit-content;align-self:flex-end;max-width:80%;}
        .chat-input-area{display:flex;gap:8px;}
        .category-options{display:flex;flex-direction:column;gap:6px;margin-bottom:8px;}
      `}</style>
    </>
  )
}

function Tab({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={active?'active':''}><Icon size={18}/><span>{label}</span></button>
  )
}