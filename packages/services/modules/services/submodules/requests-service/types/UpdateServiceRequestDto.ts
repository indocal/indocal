import { ServiceRequestStatus } from './ServiceRequest';

export type UpdateServiceRequestDto = Partial<{
  status: ServiceRequestStatus;
}>;

export default UpdateServiceRequestDto;
