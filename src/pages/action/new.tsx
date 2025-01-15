'use client';

import { useAccount } from 'wagmi';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';

// my hooks
import { useSubmitNewAction } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';
import { parseUnits } from '@/src/lib/format';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import Header from '@/src/components/Header';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // 假设你有这个组件

// 定义表单校验规则
const FormSchema = z.object({
  actionName: z.string().min(1, { message: '行动名称不能为空' }),
  consensus: z.string().min(1, { message: '行动共识不能为空' }),
  verificationRule: z.string().min(1, { message: '验证规则不能为空' }),
  verificationInfoGuide: z.string().min(1, { message: '验证提示不能为空' }),
  rewardAddressCount: z
    .string()
    .min(1, { message: '奖励地址数不能为空' })
    .refine((val) => Number(val) > 0, { message: '奖励地址数必须大于0' }),
  maxStake: z
    .string()
    .min(1, { message: '最大质押不能为空' })
    .refine((val) => Number(val) > 0, { message: '最大质押必须大于0' }),
  whiteList: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const NewAction = () => {
  const { chain: accountChain } = useAccount();
  const router = useRouter();
  const {
    submitNewAction,
    isWriting: isSubmitting,
    isConfirming,
    isConfirmed: isSubmitted,
    writeError: submitError,
    writeData,
  } = useSubmitNewAction();
  const { token } = useContext(TokenContext) || {};

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (submitError) {
      handleContractError(submitError, 'submit');
    }
  }, [submitError]);

  // 表单
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      actionName: '',
      consensus: '',
      verificationRule: '',
      verificationInfoGuide: '',
      rewardAddressCount: '',
      maxStake: '',
      whiteList: '',
    },
    mode: 'onChange',
  });

  // 提交表单
  const onSubmit = async (values: FormValues) => {
    if (!checkWalletConnection(accountChain)) {
      return;
    }
    const actionBody = {
      maxStake: values.maxStake ? parseUnits(values.maxStake) : 0n,
      maxRandomAccounts: values.rewardAddressCount ? BigInt(values.rewardAddressCount) : 0n,
      whiteList: values.whiteList ? values.whiteList.split(',').map((addr) => addr.trim() as `0x${string}`) : [],
      action: values.actionName,
      consensus: values.consensus,
      verificationRule: values.verificationRule,
      verificationInfoGuide: values.verificationInfoGuide,
    };
    await submitNewAction(token?.address as `0x${string}`, actionBody);
  };

  // 提交后跳转
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="actionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>行动名称</FormLabel>
                  <FormControl>
                    <Input placeholder="一句话说明行动" className="!ring-secondary-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consensus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>行动共识</FormLabel>
                  <FormControl>
                    <Input placeholder="描述行动所基于的共识" className="!ring-secondary-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verificationRule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>验证规则</FormLabel>
                  <FormControl>
                    <Textarea placeholder="验证者验证的规则" className="!ring-secondary-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verificationInfoGuide"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>验证提示</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="提示给行动参与者，辅助参与者填写信息"
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rewardAddressCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>奖励地址数</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="地址数必须大于0"
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxStake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>最大质押</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="最大质押数必须大于0"
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whiteList"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>白名单</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="不填为不限，或多个地址用逗号分隔"
                      className="!ring-secondary-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>多个地址用逗号分隔</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || isConfirming || isSubmitted} className="mt-4 w-full">
              {isSubmitting ? '提交中...' : isConfirming ? '确认中...' : isSubmitted ? '已提交' : '提交'}
            </Button>
            <p className="text-greyscale-500 text-sm">
              发起后，会自动推举该行动到当前投票轮的行动列表 / 本轮已推举或提交过
            </p>
          </form>
        </Form>
      </div>
      <LoadingOverlay isLoading={isSubmitting || isConfirming} text={isSubmitting ? '提交交易...' : '确认交易...'} />
    </>
  );
};

export default NewAction;
