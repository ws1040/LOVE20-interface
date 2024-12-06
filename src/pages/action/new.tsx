import { useAccount } from 'wagmi';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

import { useSubmitNewAction } from '@/src/hooks/contracts/useLOVE20Submit';
import { TokenContext } from '@/src/contexts/TokenContext';
import { parseUnits } from '@/src/lib/format';
import Header from '@/src/components/Header';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';
import { checkWalletConnection } from '@/src/utils/web3';

const NewAction = () => {
  // hook
  const { chain: accountChain } = useAccount();
  const router = useRouter();
  const {
    submitNewAction,
    isWriting: isSubmitting,
    isConfirming: isConfirming,
    isConfirmed: isSubmitted,
    writeError: submitError,
    writeData,
  } = useSubmitNewAction();
  const { token } = useContext(TokenContext) || {};

  // 表单数据
  const [form, setForm] = useState({
    actionName: '',
    consensus: '',
    verificationRule: '',
    verificationInfoGuide: '',
    rewardAddressCount: '',
    maxStake: '',
    whiteList: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    const actionBody = {
      maxStake: form.maxStake ? parseUnits(form.maxStake) : 0n,
      maxRandomAccounts: form.rewardAddressCount ? BigInt(form.rewardAddressCount) : 0n,
      whiteList: form.whiteList ? form.whiteList.split(',').map((addr) => addr.trim() as `0x${string}`) : [],
      action: form.actionName,
      consensus: form.consensus,
      verificationRule: form.verificationRule,
      verificationInfoGuide: form.verificationInfoGuide,
    };
    await submitNewAction(token?.address as `0x${string}`, actionBody);
  };

  useEffect(() => {
    if (isSubmitted) {
      router.push(`/vote/actions4submit?symbol=${token?.symbol}`);
    }
  }, [isSubmitted, writeData]);

  return (
    <>
      <Header title="创建新行动" />
      <div className="max-w-xl mx-auto p-4">
        <LeftTitle title="创建新行动" />
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-left mb-1 text-sm text-greyscale-500">行动名称</label>
            <input
              type="text"
              name="actionName"
              value={form.actionName}
              placeholder="一句话说明行动"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-left mb-1 text-sm text-greyscale-500">行动共识</label>
            <input
              type="text"
              name="consensus"
              value={form.consensus}
              placeholder="描述行动所基于的共识"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 "
            />
          </div>
          <div>
            <label className="block text-left mb-1 text-sm text-greyscale-500">验证规则</label>
            <textarea
              name="verificationRule"
              value={form.verificationRule}
              placeholder="验证者验证的规则"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-left mb-1 text-sm text-greyscale-500">验证提示</label>
            <input
              type="text"
              name="verificationInfoGuide"
              value={form.verificationInfoGuide}
              placeholder="提示给行动参与者，辅助参与者填写信息"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-left mb-1 text-sm text-greyscale-500">奖励地址数</label>
            <input
              type="number"
              name="rewardAddressCount"
              value={form.rewardAddressCount}
              placeholder="地址数必须大于0"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 "
            />
          </div>
          <div>
            <label className="block text-left mb-1 text-sm text-greyscale-500">最大质押</label>
            <input
              type="number"
              name="maxStake"
              value={form.maxStake}
              onChange={handleChange}
              placeholder="最大质押数必须大于0"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 "
            />
          </div>
          <div>
            <label className="block text-left mb-1 text-sm text-greyscale-500">白名单</label>
            <input
              type="text"
              name="whiteList"
              value={form.whiteList}
              onChange={handleChange}
              placeholder="不填为不限，或多个地址用逗号分隔"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting || isConfirming} className={`mt-4 w-full`}>
            {isSubmitting || isConfirming ? '提交中...' : '提交'}
          </Button>
          <p className="text-greyscale-500 text-sm">
            发起后，会自动推举该行动到当前投票轮的行动列表 / 本轮已推举或提交过
          </p>
        </div>
        {submitError && <div className="text-red-500 text-center">{submitError.message}</div>}
      </div>
      <LoadingOverlay isLoading={isSubmitting || isConfirming} />
    </>
  );
};

export default NewAction;
