import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Token } from '@/src/contexts/TokenContext';
import { LaunchInfo } from '@/src/types/life20types';
import LeftTitle from '../Common/LeftTitle';

const Todeploy: React.FC<{ token: Token; launchInfo: LaunchInfo }> = ({ token, launchInfo }) => {
  return (
    <div className="p-6">
      <LeftTitle title="部署子币" />
      <div className="w-full text-center">
        <Button variant="outline" size="sm" className="mt-2 w-1/2 text-secondary border-secondary" asChild>
          <Link href={`/launch/deploy?symbol=${token?.symbol}`}>
            <Plus className="w-4 h-4" />
            去部署
          </Link>
        </Button>
      </div>
      <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 text-sm mt-4">
        <p className="mb-1">说明：</p>
        <p>1. 部署者：须持有${token?.symbol}不少于 0.5%的治理票</p>
        <p>2. 子币发射目标：须筹集 20,000,000个 {token?.symbol}</p>
      </div>
    </div>
  );
};

export default Todeploy;
