import { KakaoAuth } from '@/auth/infrastructure/kakao/auth/kakao.auth';
import { Module } from '@nestjs/common';

@Module({
  providers: [KakaoAuth],
  exports: [KakaoAuth],
})
export class KakaoModule {}
