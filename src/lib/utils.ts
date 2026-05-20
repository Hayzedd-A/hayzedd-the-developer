export const experienceYear = (startYear: number) => {
  const currentYear = new Date().getFullYear();
  return `${currentYear - startYear}+ Years`;
};
