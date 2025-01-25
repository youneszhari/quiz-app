"use client";

import { MenuIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../dark-mode/mode-toggle";

import { LuAlignCenter } from "react-icons/lu";
import { Link } from "react-router-dom";


interface Navbar5Props {handleNavigation: (route: string) => void;}
  
  
  
function Navbar5({ handleNavigation }: Navbar5Props) {
    const links = [
        /* {
            title: "Home",
            description: "Home",
            href: "/",
        }, */
        {
            title: "ALL QUIZZES",
            description: "List of all quizzes",
            href: "quizzes",
        },
        {
          title: "STUDENTS HISTORY",
          description: "History of students scores.",
          href: "quiz-history",
          },
        /* 
        {
            title: "MY QUIZZES",
            description: "List of your quizzes",
            href: "my-quizzes",
        },
        {
            title: "QUIZ RESULTS",
            description: "Results of your quizzes",
            href: "result",
        }, */
    ];

  return (
    <section className=" border p-4 rounded-lg shadow-sm">
      <div className="container">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/")}>
            <LuAlignCenter className="text-4xl" /><span className="text-xl font-bold ">QUIIIZIFY</span>
          </div>
          <NavigationMenu className="mx-7 hidden lg:block">
            <NavigationMenuList>
              {/* <NavigationMenuItem>
                <NavigationMenuTrigger >Quizzes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {links.map((link, index) => (
                      <NavigationMenuLink
                        onClick={() => handleNavigation(link.href)}
                        key={index}
                        className="cursor-pointer rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <div key={link.title}>
                            <LuAlignCenter/>
                          <p className="mb-1 font-semibold">{link.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem> */}
              {links.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    onClick={() => handleNavigation(link.href)}
                    key={index}
                    style={{ cursor: "pointer" }}
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            {/* <Button variant="outline">Sign in</Button> */}
            <ModeToggle/>
          </div>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                    <MenuIcon className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            
            <SheetContent side="top" className="max-h-screen overflow-scroll">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-4">
                    <LuAlignCenter className="text-4xl" /><span className="text-xl font-bold ">QUIIIZI</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col">
                {/* <Accordion type="single" collapsible className="mb-2 mt-4">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {links.map((link, index) => (
                          <a
                            onClick={() => handleNavigation(link.href)}
                            key={index}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <div key={link.title}>
                              <p className="mb-1 font-semibold">
                                {link.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {link.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="my-2 flex flex-col gap-6">
                    <div className="grid md:grid-cols-2">
                        {links.map((link, index) => (
                            <a
                            onClick={() => handleNavigation(link.href)}
                            key={index}
                            className="cursor-pointer rounded-md p-3 transition-colors hover:bg-muted/70"
                            >
                            <div key={link.title}>
                                <p className="mb-1 font-semibold">
                                {link.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                {link.description}
                                </p>
                            </div>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 lg:flex">
                    <Button variant="outline">Sign in</Button>
                    <ModeToggle/>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

export default Navbar5;
