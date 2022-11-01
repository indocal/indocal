import { Component, PropsWithChildren } from 'react';
import {
  Backdrop,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';

interface ErrorBoundaryState {
  loading: boolean;
  hasError: boolean;
  errorCount: number;
}

export interface ErrorBoundaryProps {
  fullscreen?: boolean;
  message?: string;
  logger?: (error: unknown) => void | Promise<void>;
  onTryAgain?: (errorCount: number) => void | Promise<void>;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(
    props:
      | PropsWithChildren<ErrorBoundaryProps>
      | Readonly<PropsWithChildren<ErrorBoundaryProps>>
  ) {
    super(props);

    this.state = {
      loading: false,
      hasError: false,
      errorCount: 0,
    };

    this.handleTryAgain = this.handleTryAgain.bind(this);
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> | null {
    return { hasError: true };
  }

  async componentDidCatch(error: unknown, errorInfo: unknown): Promise<void> {
    if (this.props.logger) await this.props.logger({ error, errorInfo });

    this.setState((prevState) => ({ errorCount: prevState.errorCount + 1 }));
  }

  async handleTryAgain(): Promise<void> {
    this.setState({ loading: true });

    if (this.props.onTryAgain)
      await this.props.onTryAgain(this.state.errorCount);

    setTimeout(() => this.setState({ loading: false, hasError: false }), 2000);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Backdrop
          component={this.props.fullscreen ? 'div' : Paper}
          open
          invisible
          sx={{
            position: this.props.fullscreen ? 'fixed' : 'relative',
            top: (theme) => (this.props.fullscreen ? theme.spacing(-4) : 0),
            left: (theme) => (this.props.fullscreen ? theme.spacing(-4) : 0),
            display: 'grid',
            placeContent: 'center',
            placeItems: 'center',
            gap: (theme) => theme.spacing(1),
            width: this.props.fullscreen ? '100vw' : '100%',
            height: this.props.fullscreen ? '100vh' : '100%',
            padding: (theme) => theme.spacing(4),
            overflow: 'auto',
          }}
        >
          {this.state.loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography
                variant="subtitle1"
                align="center"
                fontWeight="bolder"
                color="error"
              >
                {this.props.message || 'Ha ocurrido un error inesperado'}
              </Typography>

              <Button variant="contained" onClick={this.handleTryAgain}>
                Intentar otra vez
              </Button>
            </>
          )}
        </Backdrop>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
