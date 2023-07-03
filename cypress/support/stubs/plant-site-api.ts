export const stubPresignedUrlsAndReturn = (body) => {
  cy.intercept(
    'https://app.ngahuha-map-dev.com:8080/blob/presigned-upload-url',
    { statusCode: 200, body: body },
  );
};

export const stubBlobUpload = () => {
  cy.intercept(
    { method: 'PUT', url: 'https://coolupload.com' },
    { statusCode: 200 },
  );
};
