page 50100 "Simpler Payment Registration"
{
    Caption = 'Payment Registration';
    PageType = Worksheet;
    ApplicationArea = All;
    UsageCategory = Tasks;

    layout
    {
        area(Content)
        {
            usercontrol(Simpler; Simpler)
            {
                ApplicationArea = All;
                
                trigger OnControlReady();
                begin
                    SimplerPaymentRegistration.Initialize(CurrPage.Simpler);
                end;
            }
        }
    }

    actions
    {
        area(Processing)
        {
            action(Process)
            {
                Caption = 'Post Payments';
                Image = PostedPayment;
                Promoted = true;
                PromotedCategory = Process;
                ApplicationArea = all;

                trigger OnAction();
                begin
                    Message('Honestly?\\This is a Control Add-ins demo, not a journal posting demo.\\I am not posting this on general principles!\\😎😜🤘🤘')
                end;
            }
        }
    }

    var
        SimplerPaymentRegistration: Codeunit "Simpler Payment Registration";
}
