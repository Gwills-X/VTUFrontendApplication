import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  ShieldCheck,
  Zap as Fast,
  Headphones,
  ArrowRight,
  Globe,
  ChevronRight,
} from "lucide-react";

// Animation Variants - Optimized for repeat triggering
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
};

const Home = () => {
  return (
    <div className='min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden'>
      {/* --- NAVIGATION --- */}
      <nav className='fixed w-full top-0  z-50 bg-white/90 backdrop-blur-md border-b border-slate-100'>
        <div className='flex items-center justify-between px-8 py-5 max-w-7xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2'>
            <div className='w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center'>
              <Fast className='text-white' size={18} />
            </div>
            VTU<span className='text-blue-600'>FLASH</span>
          </motion.div>

          <div className='hidden md:flex gap-10 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400'>
            <a
              href='#services'
              className='hover:text-blue-600 transition-colors'>
              Services
            </a>
            <a
              href='#features'
              className='hover:text-blue-600 transition-colors'>
              Tech
            </a>
            <a
              href='#support'
              className='hover:text-blue-600 transition-colors'>
              Support
            </a>
          </div>

          <div className='flex items-center gap-6'>
            <Link
              to='/login'
              className='hidden sm:block font-black text-[10px] uppercase tracking-widest text-slate-900 hover:text-blue-600 transition'>
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to='/register'
                className='px-7 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100'>
                Join Now
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- (Reduced padding) */}
      <section className='relative pt-20 pb-24 px-8'>
        <div className='max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center'>
          <motion.div
            initial='initial'
            whileInView='whileInView'
            viewport={{ once: false, amount: 0.3 }}
            variants={staggerContainer}
            className='text-center lg:text-left'>
            <motion.div
              variants={fadeInUp}
              className='inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest mb-8'>
              <span className='h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse'></span>
              Fastest Delivery in Nigeria
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className='text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter'>
              Data Vending <br />
              <span className='text-blue-600'>Redefined.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className='mt-8 text-xl text-slate-500 max-w-lg leading-relaxed font-medium'>
              Experience zero-fail transactions. Our automated gateway handles
              thousands of requests per second with 99.9% success.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className='mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
              <Link
                to='/register'
                className='px-10 py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 group'>
                Get Started{" "}
                <ArrowRight
                  size={16}
                  className='group-hover:translate-x-1 transition-transform'
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className='hidden lg:flex items-center justify-center'>
            <div className='relative w-full max-w-md aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 p-10'>
              <div className='w-full h-full border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center p-6'>
                <div className='w-16 h-16 bg-white rounded-2xl shadow-sm mb-4 flex items-center justify-center'>
                  <ShieldCheck className='text-blue-600' size={32} />
                </div>
                <h3 className='font-black text-slate-900'>Encrypted Gateway</h3>
                <p className='text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest'>
                  Bank-Level Security
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- (Reduced padding) */}
      <section id='services' className='py-24 bg-slate-50 px-8'>
        <div className='max-w-7xl mx-auto'>
          <motion.div
            initial='initial'
            whileInView='whileInView'
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
            className='mb-16'>
            <motion.h2
              variants={fadeInUp}
              className='text-4xl md:text-5xl font-black text-slate-900 tracking-tight'>
              Premium Services.
            </motion.h2>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
            {/* Primary Large Card */}
            <motion.div
              initial='initial'
              whileInView='whileInView'
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className='md:col-span-8 bg-white p-12 rounded-[3rem] border border-slate-200/60 shadow-sm transition-all group'>
              <div className='w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8'>
                <Wifi size={32} />
              </div>
              <h3 className='text-3xl font-black mb-4'>Bulk Data Bundles</h3>
              <p className='text-lg text-slate-500 leading-relaxed max-w-lg mb-8 font-medium'>
                SME, Corporate Gifting, and standard plans available for all
                networks at wholesale prices.
              </p>
              <div className='flex gap-3'>
                {["MTN", "AIRTEL", "GLO", "9MOBILE"].map((net) => (
                  <span
                    key={net}
                    className='px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-black tracking-widest'>
                    {net}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Dark Side Card */}
            <motion.div
              initial='initial'
              whileInView='whileInView'
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className='md:col-span-4 bg-slate-900 p-12 rounded-[3rem] text-white shadow-xl flex flex-col justify-between'>
              <div>
                <div className='w-14 h-14 bg-white/10 text-blue-400 rounded-2xl flex items-center justify-center mb-8'>
                  <Smartphone size={28} />
                </div>
                <h3 className='text-2xl font-black mb-4'>Airtime VTU</h3>
                <p className='text-slate-400 text-sm leading-relaxed font-medium'>
                  Get instant 3-5% discount on every airtime purchase
                  automatically.
                </p>
              </div>
              <Link
                to='/register'
                className='mt-8 text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2'>
                Buy Now <ChevronRight size={14} />
              </Link>
            </motion.div>

            {/* Bottom Row - Utility Cards */}
            {[
              {
                icon: <Tv size={32} />,
                title: "Cable TV",
                color: "text-purple-600",
                desc: "GOtv, DStv & Startimes.",
              },
              {
                icon: <Zap size={32} />,
                title: "Electricity",
                color: "text-yellow-500",
                desc: "All Disco tokens instant.",
              },
              {
                icon: <Globe size={32} />,
                title: "Exam Pins",
                color: "text-green-500",
                desc: "WAEC, NECO & JAMB.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial='initial'
                whileInView='whileInView'
                viewport={{ once: false, amount: 0.1 }}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className='md:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm'>
                <div className={`${item.color} mb-6`}>{item.icon}</div>
                <h4 className='font-black text-xl mb-3'>{item.title}</h4>
                <p className='text-slate-500 text-sm font-medium'>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- (Reduced padding) */}
      <section className='py-24 px-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className='max-w-7xl mx-auto bg-slate-900 rounded-[3.5rem] p-16 text-white grid md:grid-cols-3 gap-16 text-center'>
          <div>
            <p className='text-5xl font-black tracking-tighter mb-2'>0.1s</p>
            <p className='text-[9px] font-black uppercase tracking-[0.3em] text-blue-400'>
              Response
            </p>
          </div>
          <div>
            <p className='text-5xl font-black tracking-tighter mb-2'>99.9%</p>
            <p className='text-[9px] font-black uppercase tracking-[0.3em] text-blue-400'>
              Uptime
            </p>
          </div>
          <div>
            <p className='text-5xl font-black tracking-tighter mb-2'>24/7</p>
            <p className='text-[9px] font-black uppercase tracking-[0.3em] text-blue-400'>
              Monitoring
            </p>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER --- (Reduced padding) */}
      <footer className='py-20 px-8 bg-white'>
        <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-12 border-b border-slate-100 pb-16'>
          <div className='col-span-2 md:col-span-6'>
            <div className='text-2xl font-black text-slate-900 mb-6 tracking-tighter'>
              VTU<span className='text-blue-600'>FLASH</span>
            </div>
            <p className='text-sm text-slate-400 max-w-xs font-bold uppercase tracking-widest'>
              The Infrastructure for digital vending.
            </p>
          </div>

          <div className='col-span-1 md:col-span-3'>
            <h4 className='font-black text-[10px] uppercase tracking-widest text-slate-900 mb-6'>
              Company
            </h4>
            <ul className='space-y-4 text-xs font-bold text-slate-400'>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  About
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          <div className='col-span-1 md:col-span-3'>
            <h4 className='font-black text-[10px] uppercase tracking-widest text-slate-900 mb-6'>
              Social
            </h4>
            <ul className='space-y-4 text-xs font-bold text-slate-400'>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='max-w-7xl mx-auto flex justify-between items-center mt-10'>
          <p className='text-slate-300 text-[9px] font-black uppercase tracking-[0.3em]'>
            © 2026 VTUFLASH
          </p>
          <div className='flex gap-6 text-slate-200'>
            <ShieldCheck size={20} />
            <Headphones size={20} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
