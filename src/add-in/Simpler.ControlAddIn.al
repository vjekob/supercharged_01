controladdin Simpler
{
    Scripts =
        'https://polyfill.io/v3/polyfill.min.js?flags=gated%2Calways&features=Symbol%2CElement.prototype.append%2CArray.prototype.includes',
        'src/add-in/scripts/simpler.min.js';
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