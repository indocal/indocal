export type FormGeneratorMessages = Partial<{
  saveResponse: string;
  submitAnotherResponse: string;
  thankYouMessage: {
    title: string;
    feedback: string;
  };
}>;

export type FormGeneratorConfig = Partial<{
  acceptMultipleResponses: boolean;
  messages: FormGeneratorMessages;
}>;

export const initialConfig: FormGeneratorConfig = {
  acceptMultipleResponses: false,
  messages: {
    saveResponse: 'Guardar respuestas',
    submitAnotherResponse: 'Enviar otras respuestas',
    thankYouMessage: {
      title: 'Respuestas recibidas',
      feedback:
        'Hemos recibido sus respuestas, estaremos trabajando para brindarle la mejor experiencia',
    },
  },
};

export default initialConfig;
