import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Particles } from '../ui/particles';
import { useTheme } from '../dark-mode/theme-provider';
import { HyperText } from '../ui/hyper-text';

function Home() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const navigate = useNavigate();

  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");
 
  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <section className="overflow-hidden py-32">
      <motion.div
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="relative flex flex-col gap-5"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div
            style={{
              transform: "translate(-50%, -50%)",
            }}
            className="absolute left-1/2 top-1/2 -z-10 mx-auto size-[800px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
          >
            <div className="size-full rounded-full border p-16 md:p-32">
              <div className="size-full rounded-full border"></div>
            </div>
          </div>
          <motion.span
            className="cursor-pointer mx-auto flex size-16 items-center justify-center rounded-full border md:size-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            onClick={() => navigate('/quizzes')}
          >
            <Play className="size-6 fill-primary" />
          </motion.span>

          <motion.h1
            className="mx-auto max-w-screen-lg text-balance text-center text-3xl font-medium md:text-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Discover the Power of Interactive Quizzes

          </motion.h1>
          <motion.p
            className="mx-auto max-w-screen-md text-center text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Create, share, and export quizzes effortlessly with our comprehensive quiz platform.
          </motion.p>
          <HyperText className='text-center'>POWERED WITH Ai!</HyperText>
          <motion.div
            className="flex flex-col items-center justify-center gap-3 pb-12 pt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Button size="lg" onClick={() => navigate('/quizzes')}>
              Get Started <Zap className="ml-2 size-4" />
            </Button>
            <div className="text-xs text-muted-foreground">
              Join thousands of users worldwide
            </div>
          </motion.div>
          <Particles
                className="absolute inset-0 z-0"
                quantity={100}
                ease={80}
                color={color}
                refresh
            />
        </motion.div>
        {/* <motion.img
          ref={ref}
          src="https://shadcnblocks.com/images/block/placeholder-1.svg"
          alt="placeholder"
          className="mx-auto h-full max-h-[524px] w-full max-w-screen-lg rounded-2xl object-cover"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1 }}
        /> */}
      </motion.div>
    </section>
  );
}

export default Home;