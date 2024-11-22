import { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

import { useDeployToken } from '@/src/hooks/contracts/useLOVE20Launch';
import { TokenContext } from '@/src/contexts/TokenContext';
import Loading from '../Common/Loading';
import LoadingOverlay from '../Common/LoadingOverlay';
import router from 'next/router';

export default function TokenDeployment() {
  // 中间变量
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState('');

  // 检查连接钱包
  const { isConnected } = useAccount();

  // 从hook获得部署token的函数
  const { deployToken, isWriting, writeError, isConfirming, isConfirmed, writeData } = useDeployToken();

  useEffect(() => {
    if (writeError) {
      setError(writeError.message || '部署失败');
    }
  }, [writeError]);

  // 当前token
  const tokenContext = useContext(TokenContext);
  const { token } = tokenContext || {};
  if (!token) {
    return <Loading />;
  }

  // 检查输入是否合法
  const checkInput = () => {
    if (symbol.length > 6) {
      setError('字符串名称，仅限6个byte');
      return false;
    }
    if (!/^[A-Z0-9]+$/.test(symbol)) {
      setError('只能用大写字母A~Z和数字0~9');
      return false;
    }
    if (!/^[A-Z]/.test(symbol)) {
      setError('必须已大写字母A~Z开头');
      return false;
    }
    return true;
  };

  // 部署子币
  const handleDeploy = async () => {
    setError('');
    if (!isConnected) {
      setError('请先连接钱包');
      return;
    }
    if (!symbol) {
      setError('请输入代币符号');
      return;
    }
    if (!checkInput()) {
      return;
    }

    try {
      await deployToken(symbol, token.address as `0x${string}`);
    } catch (error) {
      setError((error as Error).message || '部署失败');
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      router.push(`/launch/tokens`);
    }
  }, [isConfirmed]);

  const isLoading = isWriting || isConfirming;
  const isSuccess = isConfirmed;

  console.log('writeData', writeData);

  return (
    <Card className="w-full border-none shadow-none rounded-none">
      <LoadingOverlay isLoading={isLoading} />

      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">部署子币</CardTitle>
        <CardDescription className="text-center">创建 ${token.symbol} 的子币</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="symbol">子币符号</Label>
          <Input
            id="symbol"
            placeholder="大写字母A~Z和数字0~9，6个字符，例如: LIFE20"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isSuccess && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>成功</AlertTitle>
            <AlertDescription>代币部署成功！</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleDeploy}
          disabled={isLoading || !isConnected || isSuccess}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              部署中...
            </>
          ) : (
            '部署'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
