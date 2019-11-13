controladdin Simpler
{
    Scripts =
        'src/add-in/scripts/numeral.min.js',
        'src/add-in/scripts/simpler.js';

    StartupScript = 'src/add-in/scripts/start.js';

    StyleSheets = 'src/add-in/styles/simpler.css';

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