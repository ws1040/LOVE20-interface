'use client';

import { useAccount } from 'wagmi';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

// 如果你使用了 lucide-react
import { Plus, Trash2 } from 'lucide-react';

// 如果你使用了 shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// 你的业务相关
import Header from '@/src/components/Header';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingOverlay from '@/src/components/Common/LoadingOverlay';

import { useSubmitNewAction } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { checkWalletConnection } from '@/src/lib/web3';
import { parseUnits } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';

const FormSchema = z.object({
  actionName: z.string().min(1, { message: '行动名称不能为空' }),
  consensus: z.string().min(1, { message: '行动共识不能为空' }),
  verificationRule: z.string().min(1, { message: '验证规则不能为空' }),

  // 使用数组存储多组 key-value
  verificationPairs: z.array(
    z.object({
      key: z.string().min(1, { message: '验证名称不能为空' }),
      value: z.string().min(1, { message: '验证信息提示不能为空' }),
    }),
  ),

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

export default function NewAction() {
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

  // 合约错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (submitError) {
      handleContractError(submitError, 'submit');
    }
  }, [submitError, handleContractError]);

  // 初始化表单
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      actionName: '',
      consensus: '',
      verificationRule: '',
      verificationPairs: [{ key: '', value: '' }], // 初始仅1组
      rewardAddressCount: '',
      maxStake: '',
      whiteList: '',
    },
    mode: 'onChange',
  });

  // 动态数组
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'verificationPairs',
  });

  // 提交表单
  const onSubmit = async (values: FormValues) => {
    if (!checkWalletConnection(accountChain)) return;

    // 拆分多组 key / value
    const verificationKeys = values.verificationPairs.map((p) => p.key);
    const verificationInfoGuides = values.verificationPairs.map((p) => p.value);

    const actionBody = {
      maxStake: values.maxStake ? parseUnits(values.maxStake) : 0n,
      maxRandomAccounts: values.rewardAddressCount ? BigInt(values.rewardAddressCount) : 0n,
      whiteList: values.whiteList ? (values.whiteList.split(',').map((addr) => addr.trim()) as `0x${string}`[]) : [],
      action: values.actionName,
      consensus: values.consensus,
      verificationRule: values.verificationRule,
      verificationKeys,
      verificationInfoGuides,
    };

    await submitNewAction(token?.address as `0x${string}`, actionBody);
  };

  // 提交成功后跳转
  useEffect(() => {
    if (isSubmitted) {
      router.push(`/vote/actions4submit?symbol=${token?.symbol}`);
    }
  }, [isSubmitted, writeData, router, token?.symbol]);

  return (
    <>
      <Header title="创建新行动" />
      <div className="max-w-xl p-4">
        <LeftTitle title="创建新行动" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* 行动名称 */}
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

            {/* 行动共识 */}
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

            {/* 验证规则 */}
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

            {/* ----------------------------
                多组 Key/Value (Card 样式)
            -----------------------------*/}
            <div>
              <FormLabel>验证信息</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((item, index) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {/* Key + 删除按钮 */}
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name={`verificationPairs.${index}.key`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Input placeholder="名称或关键词" className="!ring-secondary-foreground" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="flex-shrink-0"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Value */}
                        <FormField
                          control={form.control}
                          name={`verificationPairs.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="给参与者的提示信息"
                                  className="!ring-secondary-foreground"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ key: '', value: '' })}
                  className="w-1/2 mt-2 border-secondary text-secondary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  添加验证信息
                </Button>
              </div>
            </div>

            {/* 奖励地址数 */}
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

            {/* 最大质押 */}
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

            {/* 白名单 */}
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

            {/* 提交按钮 */}
            <Button type="submit" disabled={isSubmitting || isConfirming || isSubmitted} className="mt-4 w-full">
              {isSubmitting ? '提交中...' : isConfirming ? '确认中...' : isSubmitted ? '已提交' : '提交'}
            </Button>
          </form>
        </Form>

        {/* 说明 */}
        <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 text-sm mt-4">
          <p className="mb-1">说明：</p>
          <p>1. 每个轮次，1个地址最多可以 创建/推举 1 个行动；</p>
          <p>2. 创建后，会自动推举该行动；</p>
        </div>
      </div>

      <LoadingOverlay isLoading={isSubmitting || isConfirming} text={isSubmitting ? '提交交易...' : '确认交易...'} />
    </>
  );
}
