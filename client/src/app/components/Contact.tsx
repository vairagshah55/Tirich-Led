import { motion } from 'motion/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { SectionShell } from './SectionShell';
import { Button } from './ui/button';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

type FormInputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);
    // In a real application, you would send the data to a server/API here.
    toast.success('Message sent successfully! We will get back to you soon.');
    reset();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <SectionShell id="contact" className="py-24 px-6 bg-slate-950 scroll-mt-20">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, a project idea, or just want to say hello? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6"
            noValidate
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-card/50 border border-border/70 rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder="Your Name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full bg-card/50 border border-border/70 rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                {...register('message', { required: 'Message is required' })}
                className="w-full bg-card/50 border border-border/70 rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder="Your message..."
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg relative overflow-hidden group flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </Button>
            </motion.div>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-8 mt-8 lg:mt-0"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="text-muted-foreground">Our team is here to help.</p>
                <a href="mailto:info@brbled.com" className="text-primary hover:underline">info@brbled.com</a>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Call Us</h3>
                <p className="text-muted-foreground">Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+15551234567" className="text-secondary hover:underline">+1 (555) 123-4567</a>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Visit Us</h3>
                <p className="text-muted-foreground">123 Innovation Drive<br />Tech Valley, CA 94000</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}