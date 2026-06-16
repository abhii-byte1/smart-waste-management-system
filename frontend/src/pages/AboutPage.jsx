import { motion } from 'framer-motion';
import { Leaf, Shield, Zap } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/motion.js';

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Our Mission</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
          Transforming Waste Management with Intelligence
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          We believe in cleaner cities and faster action. By connecting citizens directly to local authorities and empowering those reports with AI, we cut down response times from days to hours.
        </p>
      </motion.section>

      <motion.section
        variants={staggerContainer(0.2)}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-3"
      >
        <motion.div variants={staggerItem} className="glow-card-green rounded-3xl bg-surface/50 p-8 text-center backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/30">
            <Leaf className="h-7 w-7 text-brand-400" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-white">Sustainability</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Reducing the environmental impact of urban waste through optimized routing and rapid response.
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="glow-card-cyan rounded-3xl bg-surface/50 p-8 text-center backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <Zap className="h-7 w-7 text-cyan-400" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-white">AI Prioritization</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Smart algorithms automatically categorize and prioritize complaints based on urgency and risk factors.
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="glow-card-amber rounded-3xl bg-surface/50 p-8 text-center backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 ring-1 ring-amber-500/30">
            <Shield className="h-7 w-7 text-amber-400" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-white">Transparency</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Citizens can track their reports in real-time, holding authorities accountable and ensuring trust.
          </p>
        </motion.div>
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="overflow-hidden rounded-3xl border border-white/[0.06] bg-surface/50 backdrop-blur"
      >
        <div className="p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">How It Works</h2>
          <div className="mt-8 space-y-8">
            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 font-bold text-brand-400 ring-1 ring-brand-500/30">1</div>
              <div>
                <h4 className="text-lg font-medium text-white">Report</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">Citizens take a photo of unmanaged waste or hazards and submit it with location details through our simple portal.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 font-bold text-brand-400 ring-1 ring-brand-500/30">2</div>
              <div>
                <h4 className="text-lg font-medium text-white">Analyze</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">Our backend system analyzes the submission, assigning it a priority level based on potential health hazards and size.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 font-bold text-brand-400 ring-1 ring-brand-500/30">3</div>
              <div>
                <h4 className="text-lg font-medium text-white">Resolve</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">Sanitation administrators use the Command Center to assign cleanup crews and update the status, keeping citizens informed.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="overflow-hidden rounded-3xl border border-brand-500/30 bg-surface/50 backdrop-blur glow-card-green"
      >
        <div className="p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Founder & Lead Developer</h2>
          <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-500/20 font-bold text-brand-400 ring-1 ring-brand-500/30 text-3xl uppercase">
              AM
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Abhishek Meena</h3>
              <p className="mt-1 text-sm font-medium text-brand-400">B.Tech in Artificial Intelligence & Machine Learning</p>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                Passionate about building innovative technology solutions that solve real-world civic and social challenges through AI and web development.
              </p>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Tech Stack</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Render'].map(tech => (
                    <span key={tech} className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-slate-300">
                      {tech}
                    </span>
                  ))}
                  <span className="rounded-lg bg-brand-500/20 border border-brand-500/30 px-3 py-1.5 text-sm text-brand-400">
                    🚀♻️
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
