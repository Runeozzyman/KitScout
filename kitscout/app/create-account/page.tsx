import HomeBackground from "@/components/background"
import Header from "@/components/header"
import CreateAccountForm from "@/components/createAccount"

export default function CreateAccount(){
    return(
        <div className="relative min-h-screen">
              <Header />
              <HomeBackground />
        
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <CreateAccountForm />
              </div>
            </div>
    )

}