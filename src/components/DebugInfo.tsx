// // 调试信息组件 - 仅在开发模式或需要调试时使用
// import React, { useEffect, useState } from 'react';

// interface DebugInfoProps {
//   showInProduction?: boolean; // 是否在生产环境显示
// }

// const DebugInfo: React.FC<DebugInfoProps> = ({ showInProduction = false }) => {
//   const [debugInfo, setDebugInfo] = useState<any>({});

//   useEffect(() => {
//     // 收集调试信息
//     const info = {
//       userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
//       hasEthereum: typeof window !== 'undefined' && !!window.ethereum,
//       hasLocalStorage: (() => {
//         try {
//           return typeof window !== 'undefined' && !!window.localStorage;
//         } catch {
//           return false;
//         }
//       })(),
//       currentUrl: typeof window !== 'undefined' ? window.location.href : 'SSR',
//       environment: process.env.NODE_ENV,
//       timestamp: new Date().toISOString(),
//     };

//     setDebugInfo(info);

//     // 输出到控制台
//     console.log('=== 调试信息 ===', info);

//     // 监听错误
//     const handleError = (event: ErrorEvent) => {
//       console.error('全局错误捕获:', {
//         message: event.message,
//         filename: event.filename,
//         lineno: event.lineno,
//         colno: event.colno,
//         error: event.error,
//       });
//     };

//     const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
//       console.error('未处理的Promise拒绝:', event.reason);
//     };

//     if (typeof window !== 'undefined') {
//       window.addEventListener('error', handleError);
//       window.addEventListener('unhandledrejection', handleUnhandledRejection);

//       return () => {
//         window.removeEventListener('error', handleError);
//         window.removeEventListener('unhandledrejection', handleUnhandledRejection);
//       };
//     }
//   }, []);

//   // 只在开发模式或明确要求时显示
//   if (process.env.NODE_ENV === 'production' && !showInProduction) {
//     return null;
//   }

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         top: 0,
//         right: 0,
//         background: 'rgba(0,0,0,0.8)',
//         color: 'white',
//         padding: '10px',
//         fontSize: '12px',
//         maxWidth: '300px',
//         zIndex: 9999,
//         borderRadius: '0 0 0 8px',
//       }}
//     >
//       <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>调试信息</div>
//       {Object.entries(debugInfo).map(([key, value]) => (
//         <div key={key} style={{ marginBottom: '4px' }}>
//           <strong>{key}:</strong> {String(value)}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DebugInfo;
