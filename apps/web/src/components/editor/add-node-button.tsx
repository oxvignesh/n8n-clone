import { Button } from "@workspace/ui/components/button";
import { PlusIcon } from "lucide-react";
import { memo } from "react";

export const AddNodeButton = memo(() => {
  return (
      <Button
        size="icon"
        variant="outline"
        className="bg-background"
      >
        <PlusIcon />
      </Button>
  )
});

AddNodeButton.displayName = "AddNodeButton";