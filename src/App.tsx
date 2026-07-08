import { AppButton, AppCard, AppInput, AppPasswordInput } from "@/components/ui";

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <AppCard className="w-full max-w-md">
        <div className="flex flex-col gap-5">
          <AppInput label="Email" placeholder="Enter email" />

          <AppPasswordInput label="Password" placeholder="Enter password" />

          <AppButton type="primary">Login</AppButton>
        </div>
      </AppCard>
    </div>
  );
}

export default App;
