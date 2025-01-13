import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';

// my funcs
import { checkWalletConnection } from '@/src/lib/web3';

// my hooks
import { useDeployToken } from '@/src/hooks/contracts/useLOVE20Launch';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import LoadingIcon from '../Common/LoadingIcon';
import LoadingOverlay from '../Common/LoadingOverlay';

export default function TokenDeployment() {
  const router = useRouter();
  const { token } = useContext(TokenContext) || {};

  // 中间变量
  const [symbol, setSymbol] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 检查连接钱包
  const { chain: accountChain } = useAccount();

  // 从hook获得部署token的函数
  const { deployToken, isWriting, writeError, isConfirming, isConfirmed } = useDeployToken();
  const handleDeploy = async () => {
    setErrorMsg('');
    if (!symbol) {
      setErrorMsg('请输入代币符号');
      return;
    }
    if (!checkInput()) {
      return;
    }
    await deployToken(symbol, token?.address as `0x${string}`);
  };
  useEffect(() => {
    if (isConfirmed) {
      router.push(`/tokens`);
    }
  }, [isConfirmed]);

  // 检查输入是否合法
  const checkInput = () => {
    if (!checkWalletConnection(accountChain)) {
      return false;
    }
    if (symbol.length > 6) {
      setErrorMsg('字符串名称，仅限6个byte');
      return false;
    }
    if (!/^[A-Z0-9]+$/.test(symbol)) {
      setErrorMsg('只能用大写字母A~Z和数字0~9');
      return false;
    }
    if (!/^[A-Z]/.test(symbol)) {
      setErrorMsg('必须已大写字母A~Z开头');
      return false;
    }
    return true;
  };

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (writeError) {
      handleContractError(writeError, 'launch');
    }
  }, [writeError]);

  if (!token) {
    return <LoadingIcon />;
  }

  const isLoading = isWriting || isConfirming;

  return (
    <>
      <Card className="w-full border-none shadow-none rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">部署子币</CardTitle>
          <CardDescription className="text-center">
            创建 <span className="text-secondary">{token.symbol}</span> 的子币
          </CardDescription>
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

          {errorMsg && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}
          {isConfirmed && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>成功</AlertTitle>
              <AlertDescription>代币部署成功！</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleDeploy} disabled={isLoading || isConfirmed}>
            {isWriting ? '提交中...' : isConfirming ? '确认中...' : isConfirmed ? '提交成功' : '提交'}
          </Button>
        </CardFooter>
      </Card>
      <LoadingOverlay isLoading={isLoading} text={isWriting ? '提交交易...' : '确认交易...'} />
    </>
  );
}
