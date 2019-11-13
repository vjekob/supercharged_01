controladdin Simpler
{
    Scripts = 'src/add-in/scripts/simpler.min.js';
    StartupScript = 'src/add-in/scripts/start.js';
    StyleSheets = 'src/add-in/styles/simpler.min.css';

    RequestedHeight = 400;
    RequestedWidth = 600;
    MaximumHeight = 1200;
    MinimumHeight = 200;

    HorizontalShrink = false;
    HorizontalStretch = true;
    VerticalShrink = true;
    VerticalStretch = true;

    event OnControlReady();

    procedure SendData(Data: JsonArray);
}