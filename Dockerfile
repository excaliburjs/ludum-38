FROM microsoft/iis

RUN mkdir C:\site

RUN powershell -Command \
    Import-Module IISAdministration; \
    New-IISSite -Name "JustWantedGroceries" -PhysicalPath C:\site -BindingInformation "*:8080:"    

ADD ./ /site

EXPOSE 8080