import React, { useState, useEffect } from 'react';

const sprintData = [
  {
    day: 1,
    title: "Setup + Auth",
    emoji: "🔧",
    deliverable: "משתמש יכול להירשם ולהתחבר",
    tasks: [
      { id: "1-1", text: "צור Vite + React + TS project", time: "1h" },
      { id: "1-2", text: "הגדר Tailwind עם RTL", time: "1h" },
      { id: "1-3", text: "צור Supabase project", time: "30m" },
      { id: "1-4", text: "צור tables + RLS policies", time: "1.5h" },
      { id: "1-5", text: "בנה דף Login בעברית", time: "1h" },
      { id: "1-6", text: "בנה דף Signup בעברית", time: "1h" },
      { id: "1-7", text: "חבר Supabase Auth", time: "1h" },
      { id: "1-8", text: "הוסף Google OAuth", time: "45m" },
      { id: "1-9", text: "בנה AuthContext + Protected Routes", time: "1h" },
    ]
  },
  {
    day: 2,
    title: "Profile + Registry + Items",
    emoji: "📝",
    deliverable: "אפשר ליצור רשימה ולהוסיף פריטים",
    tasks: [
      { id: "2-1", text: "בנה טופס השלמת פרופיל", time: "1h" },
      { id: "2-2", text: "חבר שמירה ל-Supabase", time: "45m" },
      { id: "2-3", text: "בנה יצירת Registry ראשונה", time: "1h" },
      { id: "2-4", text: "בנה Dashboard layout", time: "1h" },
      { id: "2-5", text: "בנה ItemCard component", time: "1h" },
      { id: "2-6", text: "בנה מודל הוסף פריט (ידני)", time: "1.5h" },
      { id: "2-7", text: "חבר Insert ל-DB", time: "45m" },
      { id: "2-8", text: "הוסף Edit item", time: "45m" },
      { id: "2-9", text: "הוסף Delete item", time: "30m" },
    ]
  },
  {
    day: 3,
    title: "URL Scraper",
    emoji: "🔗",
    deliverable: "הדבקת URL → Auto-fill עובד",
    tasks: [
      { id: "3-1", text: "צור Edge Function scrape-url", time: "45m" },
      { id: "3-2", text: "כתוב parser ל-Shilav", time: "1.5h" },
      { id: "3-3", text: "כתוב parser ל-Motsesim", time: "1h" },
      { id: "3-4", text: "כתוב parser ל-Baby-Star", time: "1h" },
      { id: "3-5", text: "בנה UI הדבקת URL + Loading", time: "1h" },
      { id: "3-6", text: "הצג Preview לפני שמירה", time: "1h" },
      { id: "3-7", text: "הוסף Fallback ל-manual", time: "30m" },
      { id: "3-8", text: "בדוק 20 URLs אמיתיים", time: "1h" },
      { id: "3-9", text: "תקן bugs", time: "1h" },
    ]
  },
  {
    day: 4,
    title: "Guest View",
    emoji: "👀",
    deliverable: "אורחים רואים רשימה ומתחילים קנייה",
    tasks: [
      { id: "4-1", text: "צור route /r/:slug (public)", time: "30m" },
      { id: "4-2", text: "בנה Guest Header", time: "45m" },
      { id: "4-3", text: "הצג Grid של פריטים", time: "1h" },
      { id: "4-4", text: "עצב Guest Cards", time: "1h" },
      { id: "4-5", text: "הוסף פילטרים", time: "1.5h" },
      { id: "4-6", text: "בנה כפתור קנה מתנה", time: "30m" },
      { id: "4-7", text: "צור מודל רכישה שלב 1 (פרטים)", time: "1h" },
      { id: "4-8", text: "צור מודל רכישה שלב 2 (כתובת)", time: "1h" },
      { id: "4-9", text: "צור מודל רכישה שלב 3 (סיכום)", time: "1h" },
    ]
  },
  {
    day: 5,
    title: "Green Invoice Payment",
    emoji: "💳",
    deliverable: "תשלום עובד מקצה לקצה",
    tasks: [
      { id: "5-1", text: "קבל API credentials מ-Green Invoice", time: "30m" },
      { id: "5-2", text: "צור Edge Function create-payment", time: "1h" },
      { id: "5-3", text: "כתוב getToken function", time: "30m" },
      { id: "5-4", text: "כתוב createPaymentForm (dynamic amount)", time: "1.5h" },
      { id: "5-5", text: "חבר כפתור לתשלום", time: "45m" },
      { id: "5-6", text: "צור Edge Function webhook", time: "1.5h" },
      { id: "5-7", text: "טפל ב-webhook: עדכן order + item", time: "1h" },
      { id: "5-8", text: "בנה דף הצלחה/כישלון", time: "45m" },
      { id: "5-9", text: "בדוק flow מלא ב-test mode", time: "1h" },
    ]
  },
  {
    day: 6,
    title: "Emails + Admin",
    emoji: "📧",
    deliverable: "כל האימיילים עובדים + Admin Dashboard",
    tasks: [
      { id: "6-1", text: "הגדר Resend account", time: "20m" },
      { id: "6-2", text: "כתוב תבנית אימייל לקונה", time: "1h" },
      { id: "6-3", text: "כתוב תבנית אימייל לבעל רשימה", time: "1h" },
      { id: "6-4", text: "כתוב תבנית אימייל ל-Admin", time: "45m" },
      { id: "6-5", text: "חבר שליחה ב-webhook", time: "1h" },
      { id: "6-6", text: "בדוק קבלת אימיילים", time: "45m" },
      { id: "6-7", text: "בנה Admin Dashboard - רשימת הזמנות", time: "1.5h" },
      { id: "6-8", text: "הוסף כפתורי status (purchased/shipped)", time: "1h" },
      { id: "6-9", text: "הוסף שליחת אימייל משלוח", time: "45m" },
    ]
  },
  {
    day: 7,
    title: "Sharing + Polish",
    emoji: "✨",
    deliverable: "שיתוף עובד + UI מלוטש",
    tasks: [
      { id: "7-1", text: "בנה מודל Share", time: "45m" },
      { id: "7-2", text: "הוסף Copy Link + Toast", time: "30m" },
      { id: "7-3", text: "הוסף WhatsApp share", time: "30m" },
      { id: "7-4", text: "הגדר OG meta tags", time: "1h" },
      { id: "7-5", text: "Responsive audit - mobile", time: "1.5h" },
      { id: "7-6", text: "הוסף Loading skeletons", time: "1h" },
      { id: "7-7", text: "הוסף Error states", time: "1h" },
      { id: "7-8", text: "תקן RTL issues", time: "45m" },
      { id: "7-9", text: "בנה דף נחיתה", time: "1h" },
    ]
  },
  {
    day: 8,
    title: "Test + Deploy 🚀",
    emoji: "🚀",
    deliverable: "MVP LIVE!",
    tasks: [
      { id: "8-1", text: "כתוב 20 test cases", time: "30m" },
      { id: "8-2", text: "בצע manual testing מלא", time: "2h" },
      { id: "8-3", text: "תקן bugs", time: "2h" },
      { id: "8-4", text: "בדוק RLS security", time: "30m" },
      { id: "8-5", text: "npm run build", time: "10m" },
      { id: "8-6", text: "Deploy to GitHub Pages", time: "30m" },
      { id: "8-7", text: "בדוק production", time: "30m" },
      { id: "8-8", text: "צור רשימות בדיקה", time: "30m" },
      { id: "8-9", text: "שלח לחברים לבדיקה", time: "30m" },
      { id: "8-10", text: "🎉 LAUNCH!", time: "🍾" },
    ]
  }
];

const techStack = [
  { name: "Supabase", url: "https://supabase.com/dashboard", icon: "🗄️" },
  { name: "Green Invoice", url: "https://app.greeninvoice.co.il", icon: "🧾" },
  { name: "Resend", url: "https://resend.com", icon: "📧" },
  { name: "GitHub", url: "https://github.com", icon: "🐙" },
  { name: "Tailwind", url: "https://tailwindcss.com/docs", icon: "🎨" },
];

export default function SprintTrackerV2() {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('babylist-sprint-tasks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [currentDay, setCurrentDay] = useState(1);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('babylist-sprint-notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('babylist-sprint-tasks', JSON.stringify([...completedTasks]));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('babylist-sprint-notes', JSON.stringify(notes));
  }, [notes]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId);
      return newSet;
    });
  };

  const getDayProgress = (day) => {
    const dayTasks = sprintData.find(d => d.day === day)?.tasks || [];
    const completed = dayTasks.filter(t => completedTasks.has(t.id)).length;
    return { completed, total: dayTasks.length, pct: Math.round((completed / dayTasks.length) * 100) };
  };

  const getTotalProgress = () => {
    const all = sprintData.flatMap(d => d.tasks);
    const done = all.filter(t => completedTasks.has(t.id)).length;
    return { done, total: all.length, pct: Math.round((done / all.length) * 100) };
  };

  const resetAll = () => {
    if (confirm('למחוק את כל ההתקדמות?')) {
      setCompletedTasks(new Set());
      setNotes({});
    }
  };

  const total = getTotalProgress();
  const dayData = sprintData.find(d => d.day === currentDay);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-stone-100 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#954535]">🍼 רשימת תינוק</h1>
          <p className="text-stone-600">Sprint Tracker - 8 ימים ל-MVP</p>
          <p className="text-xs text-stone-400 mt-1">Green Invoice + Supabase + GitHub Pages</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-stone-700">התקדמות כללית</span>
            <span className="text-2xl font-bold text-[#954535]">{total.pct}%</span>
          </div>
          <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-l from-[#954535] to-[#4A7C59] transition-all duration-700"
              style={{ width: `${total.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-stone-500 mt-2">
            <span>{total.done} / {total.total} משימות</span>
            <button onClick={resetAll} className="text-red-400 hover:text-red-600">איפוס</button>
          </div>
        </div>

        {/* Day Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {sprintData.map((day) => {
            const prog = getDayProgress(day.day);
            const done = prog.pct === 100;
            const active = currentDay === day.day;
            
            return (
              <button
                key={day.day}
                onClick={() => setCurrentDay(day.day)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                  active 
                    ? 'bg-[#954535] text-white shadow-lg scale-105' 
                    : done 
                      ? 'bg-[#4A7C59] text-white' 
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="text-lg">{day.emoji}</div>
                <div className="text-xs font-medium">יום {day.day}</div>
                {!active && prog.pct > 0 && prog.pct < 100 && (
                  <div className="text-[10px] opacity-70">{prog.pct}%</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Day */}
        {dayData && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
            {/* Day Header */}
            <div className="bg-gradient-to-l from-[#954535] to-[#7a3529] p-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-3xl mb-1">{dayData.emoji}</div>
                  <h2 className="text-xl font-bold">יום {dayData.day}: {dayData.title}</h2>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold">{getDayProgress(dayData.day).pct}%</div>
                  <div className="text-xs opacity-80">
                    {getDayProgress(dayData.day).completed}/{getDayProgress(dayData.day).total}
                  </div>
                </div>
              </div>
              <div className="mt-3 bg-white/20 rounded-lg p-2 text-sm">
                🎯 <span className="font-medium">{dayData.deliverable}</span>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-4 space-y-2">
              {dayData.tasks.map((task) => {
                const done = completedTasks.has(task.id);
                return (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      done 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                      done 
                        ? 'bg-[#4A7C59] border-[#4A7C59] text-white' 
                        : 'border-stone-300'
                    }`}>
                      {done && '✓'}
                    </div>
                    <span className={`flex-1 text-sm ${done ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                      {task.text}
                    </span>
                    <span className="text-xs text-stone-400 bg-white px-2 py-1 rounded-lg">
                      {task.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div className="px-4 pb-4">
              <textarea
                value={notes[dayData.day] || ''}
                onChange={(e) => setNotes(prev => ({ ...prev, [dayData.day]: e.target.value }))}
                placeholder="הערות ליום זה..."
                className="w-full p-3 border border-stone-200 rounded-xl resize-none h-20 text-sm"
              />
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {techStack.map((tech) => (
            <a
              key={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-3 rounded-xl shadow hover:shadow-md transition-all text-center"
            >
              <div className="text-xl">{tech.icon}</div>
              <div className="text-[10px] text-stone-600 mt-1">{tech.name}</div>
            </a>
          ))}
        </div>

        {/* Commands Reference */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-5">
          <h3 className="font-bold text-stone-700 mb-3">📋 פקודות מהירות</h3>
          <div className="grid md:grid-cols-2 gap-3 text-xs" dir="ltr">
            <div>
              <div className="text-stone-500 mb-1 text-right" dir="rtl">Setup</div>
              <code className="block bg-stone-100 p-2 rounded">npm create vite@latest . -- --template react-ts</code>
            </div>
            <div>
              <div className="text-stone-500 mb-1 text-right" dir="rtl">Dependencies</div>
              <code className="block bg-stone-100 p-2 rounded">npm i @supabase/supabase-js react-router-dom</code>
            </div>
            <div>
              <div className="text-stone-500 mb-1 text-right" dir="rtl">Edge Functions</div>
              <code className="block bg-stone-100 p-2 rounded">npx supabase functions deploy --all</code>
            </div>
            <div>
              <div className="text-stone-500 mb-1 text-right" dir="rtl">Deploy</div>
              <code className="block bg-stone-100 p-2 rounded">npm run build && git push</code>
            </div>
          </div>
        </div>

        {/* Payment Flow Reminder */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 shadow border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">💳 Green Invoice Flow</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>1. אורח ממלא פרטים → 2. יוצרים Order ב-DB → 3. קוראים ל-API עם הסכום</p>
            <p>4. Redirect לדף תשלום → 5. Webhook מעדכן status → 6. שולחים אימיילים</p>
          </div>
          <div className="mt-2 text-xs text-green-600">
            <strong>API:</strong> POST /paymentForm/create עם income[0].price = מחיר המוצר
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-stone-400 text-xs">
          <p>8 Days to MVP • Green Invoice • No Fees (PMF Testing)</p>
        </div>
      </div>
    </div>
  );
}
