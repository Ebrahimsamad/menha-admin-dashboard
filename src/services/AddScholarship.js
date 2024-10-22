const BASE_URL = "https://menha-backend.vercel.app";

export const getAllSelectData = async () => {
  const res1 = await fetch(`${BASE_URL}/course-type`, {
    method: "GET",
  });
  const courseType = await res1.json();

  const res2 = await fetch(`${BASE_URL}/language`, {
    method: "GET",
  });
  const courseLanguage = await res2.json();

  const res3 = await fetch(`${BASE_URL}/university`, {
    method: "GET",
  });
  const university = await res3.json();

  const res4 = await fetch(`${BASE_URL}/field-of-study`, {
    method: "GET",
  });
  const fieldOfStudy = await res4.json();

  const res5 = await fetch(`${BASE_URL}/mode-of-study`, {
    method: "GET",
  });
  const modeOfStudy = await res5.json();


  const res6 = await fetch(`${BASE_URL}/scholarship`, {
    method: "GET",
  });
  const scholarships = await res6.json();

  return {
    courseType,
    courseLanguage,
    fieldOfStudy,
    university,
    modeOfStudy,
    scholarships, 
  };
};
