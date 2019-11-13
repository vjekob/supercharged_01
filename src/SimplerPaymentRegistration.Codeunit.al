codeunit 50100 "Simpler Payment Registration"
{
    var
        FrontEnd: ControlAddIn Simpler;
        Initialized: Boolean;

    local procedure GetData() Data: JsonArray;
    var
        CustLedgEntry: Record "Cust. Ledger Entry";
        Cust: Record Customer;
        Entry: JsonObject;
    begin
        with CustLedgEntry do begin
            SetRange("Document Type", "Document Type"::Invoice);
            SetRange(Open, true);
            SetFilter("Remaining Amount", '>%1', 0);
            SetAutoCalcFields("Remaining Amount");

            if FindSet() then
                repeat
                    Cust.Get("Customer No.");

                    Clear(Entry);
                    Entry.Add('entryNo', "Entry No.");
                    Entry.Add('customerNo', "Customer No.");
                    Entry.Add('customerName', Cust.Name);
                    Entry.Add('documentDate', "Document Date");
                    Entry.Add('dueDate', "Due Date");
                    Entry.Add('amount', "Remaining Amount");
                    Entry.Add('currency', "Currency Code");
                    Data.Add(Entry);
                until Next() = 0;
        end;
    end;

    local procedure SendData();
    begin
        FrontEnd.SendData(GetData());
    end;

    procedure Initialize(FrontEndIn: ControlAddIn Simpler);
    begin
        FrontEnd := FrontEndIn;
        SendData();
        Initialized := true;
    end;
}