import { useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { Page } from '@indocal/ui';
import {
  FormGenerator,
  serializeFormGeneratorAnswers,
  FormGeneratorAnswers,
} from '@indocal/forms-generator';
import { createServiceError, UUID, Service, Form } from '@indocal/services';

import { indocal } from '@/lib';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type ServicesPageParams = {
  service_id: UUID;
};

type ServicesPageProps = {
  service: Service;
  form: Form;
};

const ServicePage: EnhancedNextPage<ServicesPageProps> = ({
  service,
  form,
}) => {
  const { data: session } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleOnSubmit = useCallback(
    async (answers: FormGeneratorAnswers) => {
      try {
        if (!session) return;

        const data = await serializeFormGeneratorAnswers(answers, indocal);

        const { error } = await indocal.services.requests.create({
          answers: data,
          service: service.id,
          requestedBy: session.user.id,
        });

        if (error) {
          enqueueSnackbar(
            error.details
              ? error.details.reduce(
                  (acc, current) => (acc ? `${acc} | ${current}` : current),
                  ``
                )
              : error.message,
            { variant: 'error' }
          );
        } else {
          enqueueSnackbar('Solicitud enviada exitosamente', {
            variant: 'success',
            onEntered: () => setIsSubmitSuccessful(true),
          });
        }
      } catch (exeption) {
        const error = createServiceError(exeption);

        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
      }
    },
    [service.id, session, enqueueSnackbar]
  );

  return (
    <Page transition="right" title={`Formulario: ${form.title}`}>
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <FormGenerator
          form={form}
          showThankYouMessage={isSubmitSuccessful}
          config={{
            acceptMultipleResponses: true,
            messages: {
              saveResponse: 'Enviar solicitud',
              submitAnotherResponse: 'Enviar otra solicitud',
              thankYouMessage: {
                title: 'Solicitud recibida',
                feedback:
                  'Hemos recibido su solicitud, estaremos procesándola lo más rápido posible',
              },
            },
          }}
          onSubmit={handleOnSubmit}
          onReset={() => setIsSubmitSuccessful(false)}
        />
      </Container>
    </Page>
  );
};

ServicePage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  ServicesPageProps,
  ServicesPageParams
> = async (ctx) => {
  const { service } = await indocal.services.findOneByUUID(
    ctx.params?.service_id as UUID
  );

  if (!service || service.status !== 'PUBLISHED') {
    return {
      notFound: true,
    };
  }

  const { form } = await indocal.forms.findOneByUUID(service.form.id);

  if (!form || form.status !== 'PUBLISHED') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service,
      form,
    },
  };
};

export default ServicePage;
