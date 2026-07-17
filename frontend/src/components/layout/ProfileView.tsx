import React, { useState, useEffect } from "react";
import { Avatar } from "../ui/Avatar";
import { useForm } from "react-hook-form";
import { userService } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

interface ProfileFormInput {
  username: string;
}

export function ProfileView() {
  const { user: currentUser, updateName: onUpdateName } = useAuth();
  const { setActiveTab } = useChat();

  const onBackToChats = () => setActiveTab("chats");
  const onTabChange = (tab: string) => setActiveTab(tab);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [crew, setCrew] = useState<{ name: string; color: string; avatar: string }[]>([]);

  const { register, handleSubmit, formState: { errors: formErrors }, setValue } = useForm<ProfileFormInput>({
    defaultValues: {
      username: currentUser.name
    }
  });

  const charCodeSum = currentUser.name
    ? currentUser.name.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)
    : 0;
  const dynamicLvl = (charCodeSum % 80) + 10;
  const dynamicStickers = (charCodeSum * 3) % 900 + 100;
  const dynamicStreaks = (currentUser.name.length * 3) || 12;
  const dynamicArt = (currentUser.name.length + 5) || 7;

  useEffect(() => {
    setValue("username", currentUser.name);
  }, [currentUser.name, setValue]);

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        const token = localStorage.getItem("zap_token");
        if (!token) return;
        const data = await userService.fetchAllUsers(token);
        // Filter out current user from crew list
        const filtered = data.filter((u: any) => u._id !== currentUser.id);
        
        const avatars = ["🐀", "🎸", "🐱", "🐶", "🦊", "🦁", "🐨", "🐸"];
        const colors = [
          "var(--color-zap-yellow)",
          "var(--color-zap-pink)",
          "var(--color-zap-cyan)",
          "var(--color-zap-purple)"
        ];

        const mappedCrew = filtered.slice(0, 4).map((u: any) => {
          const charSum = u.name.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
          return {
            name: u.name,
            color: colors[charSum % colors.length],
            avatar: avatars[charSum % avatars.length]
          };
        });
        setCrew(mappedCrew);
      } catch (err) {
        console.error("Failed to fetch crew", err);
      }
    };
    fetchCrew();
  }, [currentUser.id]);



  return (
    <div className="w-full h-full bg-[#f8f7f3] flex flex-col select-none relative min-h-0">
      
      {/* ----------------- MOBILE HEADER ----------------- */}
      <div className="md:hidden bg-zap-yellow p-4 border-b-[3.5px] border-black flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Hamburger / Back button to return to chat */}
          <button 
            onClick={onBackToChats}
            className="text-black focus:outline-none w-8 h-8 flex items-center justify-center border-2 border-black rounded-sm shadow-[1.5px_1.5px_0px_#000] bg-white active:translate-y-[1px]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Title */}
          <h2 className="font-lilita text-xl italic uppercase tracking-wider transform -skew-x-12" style={{ WebkitTextStroke: "1px black" }}>
           ZAP! CHAT YO 🤘 Let&apos;s Chat
          </h2>
        </div>
        {/* User avatar tag */}
        {/* <Avatar name="GamerTag 99" color="var(--color-zap-purple)" size="sm" isOnline={true} /> */}
      </div>

      {/* ----------------- PROFILE CONTENT SCROLL AREA ----------------- */}
      <div className="flex-grow overflow-y-auto p-6 flex flex-col items-center relative min-h-0">
        
        {/* Star backdrop decoration */}
        <div className="absolute top-[20px] left-[20px] w-24 h-24 text-[#E2E2D9] pointer-events-none select-none opacity-60">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
          </svg>
        </div>

        {/* Centered Profile Layout */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 relative z-20 mt-4 md:mt-2">
          
          {/* Desktop Back button to return to chats (Visible ONLY on desktop) */}
          <div className="hidden md:flex w-full justify-start">
            <button
              onClick={onBackToChats}
              className="px-4 py-2 bg-white text-black border-[3px] border-black rounded-sm shadow-[3px_3px_0px_#000] font-lilita text-xs uppercase cursor-pointer hover:bg-neutral-50 active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>BACK TO CHATS</span>
            </button>
          </div>

          {/* Large Profile Avatar Frame with Level tag */}
          <div className="relative mt-2">
            <div 
              className="w-32 h-32 border-[3.5px] border-black rounded-full shadow-[5px_5.5px_0px_#000] flex items-center justify-center font-lilita text-6xl uppercase text-black select-none"
              style={{ 
                backgroundColor: [
                  "var(--color-zap-purple)",
                  "var(--color-zap-cyan)",
                  "var(--color-zap-yellow)",
                  "var(--color-zap-pink)"
                ][charCodeSum % 4]
              }}
            >
              {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : (currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "G")}
            </div>
            {/* Level pink slanted badge */}
            <div className="absolute -bottom-1 right-2 bg-[#FF00E0] text-white font-lilita text-[10px] py-1 px-2 border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_#000] uppercase transform -rotate-12">
              LVL {dynamicLvl}
            </div>
          </div>

          {/* Display name and status */}
          <div className="text-center select-text flex flex-col items-center justify-center pt-2 w-full max-w-xs">
            {isEditing ? (
                  <form
                    onSubmit={handleSubmit(async (data) => {
                      const trimmedName = data.username.trim();
                      if (!trimmedName || trimmedName === currentUser.name) {
                        setIsEditing(false);
                        return;
                      }
                      setLoading(true);
                      try {
                        if (onUpdateName) {
                          await onUpdateName(trimmedName);
                        }
                        setIsEditing(false);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setLoading(false);
                      }
                    })}
                    className="flex flex-col gap-2 w-full mt-2 items-center"
                  >
                    <input
                      type="text"
                      {...register("username", { required: true })}
                      className="bg-white text-black font-lilita text-lg uppercase border-[3px] border-black px-3 py-1.5 rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] focus:outline-none text-center"
                    />
                    {formErrors.username && <span className="text-[10px] text-[#FF5E5E] font-lilita uppercase select-none">WHOA! USERNAME CANNOT BE BLANK!</span>}
                    <div className="flex gap-2 justify-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-1.5 bg-zap-purple text-white border-2 border-black rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] font-lilita text-xs uppercase cursor-pointer hover:bg-purple-800 disabled:opacity-50"
                      >
                        {loading ? "SAVING..." : "SAVE"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setValue("username", currentUser.name);
                        }}
                        className="px-3 py-1.5 bg-white text-black border-2 border-black rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] font-lilita text-xs uppercase cursor-pointer hover:bg-neutral-50"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2.5 justify-center">
                      <h2 className="font-lilita text-2xl uppercase tracking-wide">
                        @{currentUser.name || "GAMER"}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-7 h-7 bg-zap-cyan border-2 border-black rounded-sm shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all"
                        title="Edit Username"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    {/* Show user's email */}
                    {currentUser.email && (
                      <span className="font-mono text-xs text-black/60 font-bold mt-1 select-all">
                        {currentUser.email}
                      </span>
                    )}
                    {/* Crooked Status banner */}
                    <div className="inline-block mt-3 bg-zap-yellow text-black font-lilita text-xs py-2 px-5 border-[3px] border-black rounded-sm shadow-[3px_3.5px_0px_#000] transform -rotate-[3deg]">
                      Online & Hyped! ⚡
                    </div>
                  </div>
                )}
              </div>

            {/* 3 Quick Stats columns */}
            {/* <div className="w-full max-w-sm grid grid-cols-3 gap-3.5">
             
              <div className="bg-white border-[3px] border-black p-2.5 rounded-sm shadow-[3.5px_3.5px_0px_#000] flex flex-col items-center justify-center">
                <span className="font-lilita text-[8px] md:text-[9px] uppercase tracking-wider text-black/50">STICKERS</span>
                <span className="font-lilita text-lg md:text-xl text-[#FF00E0] mt-0.5">{dynamicStickers}</span>
              </div>
             
              <div className="bg-white border-[3px] border-black p-2.5 rounded-sm shadow-[3.5px_3.5px_0px_#000] flex flex-col items-center justify-center">
                <span className="font-lilita text-[8px] md:text-[9px] uppercase tracking-wider text-black/50">STREAKS</span>
                <span className="font-lilita text-lg md:text-xl text-[#8E790B] mt-0.5">{dynamicStreaks}</span>
              </div>
              
              <div className="bg-white border-[3px] border-black p-2.5 rounded-sm shadow-[3.5px_3.5px_0px_#000] flex flex-col items-center justify-center">
                <span className="font-lilita text-[8px] md:text-[9px] uppercase tracking-wider text-black/50">ART</span>
                <span className="font-lilita text-lg md:text-xl text-zap-cyan mt-0.5">{dynamicArt}</span>
              </div>
            </div> */}

            {/* MY CREW Section */}
            {/* <div className="w-full max-w-sm select-none">
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="font-lilita text-sm md:text-md uppercase tracking-wider">MY CREW</h3>
                <span className="text-[10px] md:text-xs text-[#FF00E0] font-black underline cursor-pointer hover:text-purple-800">
                  SEE ALL
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {crew.map((member, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <Avatar name={member.name} color={member.color} size="md" isOnline={true} shape="circle" />
                    <span className="font-lilita text-[9px] text-black/60 truncate w-full text-center">
                      {member.name}
                    </span>
                  </div>
                ))}
              
                <div className="flex flex-col items-center gap-1.5">
                  <button className="w-10 h-10 md:w-11 md:h-11 bg-white border-[3.5px] border-black rounded-full shadow-[2px_2px_0px_#000] flex items-center justify-center font-lilita text-lg cursor-pointer hover:translate-y-[0.5px]">
                    +
                  </button>
                  <span className="font-lilita text-[9px] text-black/60 uppercase">
                    INVITE
                  </span>
                </div>
              </div>
            </div> */}

          </div>

        </div>

      </div>
  );
}
