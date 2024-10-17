// components/AddressWithCopyButton.tsx
import toast from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

import { abbreviateAddress } from '../../utils/strings'

interface AddressWithCopyButtonProps {
  address: `0x${string}`;
}

const AddressWithCopyButton: React.FC<AddressWithCopyButtonProps> = ({ address }) => {
  const handleCopy = () => {
    toast.success('复制成功');
  };

  return (
    <>
      <span className="ml-2 text-xs text-gray-500">{abbreviateAddress(address)}</span>
      <CopyToClipboard text={address} onCopy={handleCopy}>
        <button className="">
          <ClipboardDocumentIcon className="h-4 w-4 text-xs text-gray-500" />
        </button>
      </CopyToClipboard>
    </>
  );
};

export default AddressWithCopyButton;
