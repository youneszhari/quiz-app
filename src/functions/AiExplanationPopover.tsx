import { useState } from "react";
import { usePollinationsChat } from "@pollinations/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AiExplanationPopover = ({ question, correctAnswer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { sendUserMessage, messages, isLoading } = usePollinationsChat(
    [{ role: "system", content: "You are a helpful assistant." }],
    { seed: 42, jsonMode: false, model: "openai" }
  );

  const handleAskAi = () => {
    const promptText = `Question: ${question}\nCorrect Answer: ${correctAnswer}\nPlease provide a brief explanation in 1-2 lines.`;
    setPrompt(promptText);
    sendUserMessage(promptText);
    setIsOpen(true);
  };

  const aiResponse = messages[messages.length - 1]?.content || "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button onClick={handleAskAi} variant="outline">
          Ask AI
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">AI Explanation</h4>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm">
              {aiResponse}
            </ReactMarkdown>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AiExplanationPopover;