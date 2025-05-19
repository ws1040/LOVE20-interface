'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const ChangeRound: React.FC<{ currentRound: bigint; handleChangedRound: (round: number) => void }> = ({
  currentRound,
  handleChangedRound,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelectRound = (round: number) => {
    handleChangedRound(round);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-secondary no-underline">
          切换轮次
        </Button>
      </DrawerTrigger>
      <DrawerContent className="z-[100] min-h-[25vh]">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="px-4 flex-grow">
          <div className="max-h-64 overflow-y-auto">
            {Array.from({ length: Number(currentRound) }, (_, i) => {
              const round = Number(currentRound) - i;
              return (
                <Button
                  key={round}
                  variant="ghost"
                  className="w-full p-2 text-center rounded-none hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectRound(round);
                  }}
                >
                  <span className="text-lg">第 {round} 轮</span>
                </Button>
              );
            })}
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ChangeRound;
