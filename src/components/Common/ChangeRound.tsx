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
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="max-h-64 overflow-y-auto">
            {Array.from({ length: Number(currentRound) }, (_, i) => {
              const round = Number(currentRound) - i;
              return (
                <div
                  key={round}
                  className="p-2 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectRound(round)}
                >
                  第 {round} 轮
                </div>
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
