// components/Common/AddressWithCopyButton.tsx
import toast from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

import { abbreviateAddress } from '../../utils/format';

interface AddressWithCopyButtonProps {
  address: `0x${string}`;
  showCopyButton?: boolean;
}

const AddressWithCopyButton: React.FC<AddressWithCopyButtonProps> = ({ address, showCopyButton = true }) => {
  const handleCopy = (text: string, result: boolean) => {
    if (result) {
      toast.success('复制成功');
    } else {
      toast.error('复制失败');
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault(); // 阻止默认行为
    event.stopPropagation(); // 阻止事件冒泡
  };

  return (
    <>
      <span className="text-xs text-gray-500">{abbreviateAddress(address)}</span>
      {showCopyButton && ( // 根据 showCopyButton 显示或隐藏按钮
        <CopyToClipboard text={address} onCopy={handleCopy}>
          <button className="" onClick={handleClick}>
            <ClipboardDocumentIcon className="h-4 w-4 text-xs text-gray-500" />
          </button>
        </CopyToClipboard>
      )}
    </>
  );
};

export default AddressWithCopyButton;
