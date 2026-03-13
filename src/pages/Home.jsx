import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  ShieldCheck,
  Zap as Fast,
  HeartHandshake,
  Headphones,
} from "lucide-react";

const Home = () => {
  return (
    <div className='min-h-screen bg-white text-gray-900 font-sans'>
      {/* --- NAVIGATION --- */}
      <nav className='flex items-center justify-between px-6 py-5 max-w-7xl mx-auto'>
        <div className='text-2xl font-black text-blue-600 tracking-tighter'>
          VTU<span className='text-orange-500'>FLASH</span>
        </div>
        <div className='hidden md:flex gap-8 font-medium text-gray-600'>
          <a href='#services' className='hover:text-blue-600 transition'>
            Services
          </a>
          <a href='#features' className='hover:text-blue-600 transition'>
            Why Us
          </a>
          <a href='#support' className='hover:text-blue-600 transition'>
            Support
          </a>
        </div>
        <div className='flex gap-4'>
          <Link
            to='/login'
            className='px-5 py-2 font-semibold text-gray-700 hover:text-blue-600'>
            Login
          </Link>
          <Link
            to='/register'
            className='px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition'>
            Join Now
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className='relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 pb-24 px-6'>
        <div className='max-w-7xl mx-auto text-center'>
          <span className='bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase'>
            Fastest VTU in Nigeria 🇳🇬
          </span>
          <h1 className='mt-8 text-5xl md:text-7xl font-black text-slate-900 leading-tight'>
            One Platform, <br />
            <span className='text-blue-600'>Unlimited Connections.</span>
          </h1>
          <p className='mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Cheap data, instant airtime, and seamless bill payments. We’ve built
            the most reliable system to keep you connected 24/7 without the
            stress.
          </p>
          <div className='mt-10 flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              to='/register'
              className='px-10 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold shadow-2xl shadow-blue-300 hover:scale-105 transition-transform'>
              Start Topping Up
            </Link>
            <button className='px-10 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-xl text-lg font-bold hover:bg-gray-50 transition'>
              Download App
            </button>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className='absolute top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob'></div>
        <div className='absolute bottom-0 -right-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000'></div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section id='services' className='py-24 max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-extrabold text-slate-900'>
            What We Offer
          </h2>
          <div className='h-1.5 w-20 bg-orange-500 mx-auto mt-4 rounded-full'></div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {[
            {
              icon: <Smartphone size={32} />,
              title: "Airtime",
              desc: "VTU airtime for MTN, Glo, Airtel, and 9mobile at discounted rates.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: <Wifi size={32} />,
              title: "Data Bundles",
              desc: "Massive data plans with 30-day validity for all your surfing needs.",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon: <Tv size={32} />,
              title: "Cable TV",
              desc: "Renew your DStv, GOtv, and Startimes subscriptions instantly.",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: <Zap size={32} />,
              title: "Electricity",
              desc: "Pay for prepaid and postpaid meters without leaving your house.",
              color: "bg-yellow-50 text-yellow-600",
            },
          ].map((service, i) => (
            <div
              key={i}
              className='group p-8 rounded-3xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-2xl transition-all duration-300'>
              <div
                className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className='text-xl font-bold mb-3'>{service.title}</h3>
              <p className='text-gray-500 leading-relaxed'>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section
        id='features'
        className='py-20 bg-slate-900 text-white rounded-[3rem] mx-4 md:mx-10 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-10 grid md:grid-cols-2 items-center gap-16'>
          <div>
            <h2 className='text-4xl font-bold leading-tight'>
              Reliability You Can <br /> Bank On.
            </h2>
            <p className='mt-6 text-gray-400 text-lg'>
              We understand that every second counts. Our automated system
              ensures your transaction hits your phone before you even close the
              app.
            </p>

            <div className='mt-10 space-y-6'>
              {[
                {
                  icon: <Fast className='text-orange-400' />,
                  text: "Instant Automated Delivery",
                },
                {
                  icon: <ShieldCheck className='text-blue-400' />,
                  text: "Bank-Grade Security Encryption",
                },
                {
                  icon: <Headphones className='text-green-400' />,
                  text: "24/7 Dedicated Support",
                },
              ].map((item, i) => (
                <div key={i} className='flex items-center gap-4'>
                  <div className='bg-white/10 p-2 rounded-full'>
                    {item.icon}
                  </div>
                  <span className='font-semibold'>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='relative'>
            <div className='bg-gradient-to-tr from-blue-600 to-blue-400 w-full aspect-square rounded-3xl shadow-2xl rotate-3 flex items-center justify-center'>
              <span className='text-white text-9xl font-black -rotate-3 opacity-20 underline'>
                SECURE
              </span>
              {/* This represents where a phone mockup or dashboard screenshot would go */}
              <div className='absolute inset-4 bg-slate-800 rounded-2xl border border-white/20 p-6 -rotate-3 shadow-inner'>
                <div className='h-4 w-24 bg-blue-500/50 rounded-full mb-4'></div>
                <div className='h-10 w-full bg-slate-700 rounded-lg mb-2'></div>
                <div className='h-10 w-full bg-slate-700 rounded-lg mb-2'></div>
                <div className='h-10 w-full bg-slate-700 rounded-lg'></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className='mt-24 bg-gray-50 pt-20 pb-10 px-6'>
        <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-gray-200 pb-16'>
          <div className='col-span-2 md:col-span-1'>
            <div className='text-2xl font-black text-blue-600 mb-6'>
              VTUFLASH
            </div>
            <p className='text-gray-500 italic'>
              Connecting you to the things you love most.
            </p>
          </div>
          <div>
            <h4 className='font-bold mb-6'>Quick Links</h4>
            <ul className='space-y-4 text-gray-600'>
              <li>
                <a href='#'>About Us</a>
              </li>
              <li>
                <a href='#'>Pricing</a>
              </li>
              <li>
                <a href='#'>Terms of Service</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-bold mb-6'>Services</h4>
            <ul className='space-y-4 text-gray-600'>
              <li>
                <a href='#'>Buy Data</a>
              </li>
              <li>
                <a href='#'>Airtime VTU</a>
              </li>
              <li>
                <a href='#'>Electricity Bill</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-bold mb-6'>Contact</h4>
            <ul className='space-y-4 text-gray-600 text-sm'>
              <li>support@vtuflash.com</li>
              <li>+234 800 000 0000</li>
              <li>Lagos, Nigeria</li>
            </ul>
          </div>
        </div>
        <p className='text-center mt-10 text-gray-400 text-sm'>
          © 2026 VTUFLASH. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
