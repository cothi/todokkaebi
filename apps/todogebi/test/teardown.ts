import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function teardown() {
  // MySQL에서 테이블 목록 조회
  const tableQuery = await prisma.$queryRaw<Array<{ TABLE_NAME: string }>>`
    SELECT TABLE_NAME FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
  `;

  // 테이블 이름 추출 및 필터링
  const tables = tableQuery
    .map(({ TABLE_NAME }) => TABLE_NAME)
    .filter(name => name !== '_prisma_migrations');

  // 외래 키 제약 조건 비활성화
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;

  // 각 테이블 truncate
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\`;`);
  }

  // 외래 키 제약 조건 다시 활성화
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;

  await prisma.$disconnect();
}
